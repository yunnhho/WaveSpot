# 🌊 WAVESPOT 시스템 아키텍처 설계

> TDD v1.1 · SRS v1.3 기반 | 작성일: 2026-03-09

---

## 1. 전체 시스템 구성도

```mermaid
graph TB
    subgraph Client["🖥️ Client Layer"]
        APP["Flutter App<br/>(iOS · Android)"]
        ADMIN["Admin Web<br/>(Next.js 14)"]
        WIDGET["Home Widget<br/>(Swift/Kotlin)"]
    end

    subgraph Gateway["🔀 API Gateway"]
        ALB["AWS ALB<br/>(SSL 종료, Rate Limit)"]
        NGINX["Nginx<br/>(리버스 프록시)"]
    end

    subgraph Backend["⚙️ Backend Layer"]
        API["NestJS API Server<br/>(REST + JWT)"]
        WW["Weather Worker<br/>(Cron Job)"]
        SE["Score Engine<br/>(활동 지수 계산)"]
        NW["Notification Worker<br/>(FCM 알림)"]
        TR["Tile Renderer<br/>(Phase 2)"]
    end

    subgraph Data["💾 Data Layer"]
        PG["PostgreSQL 16<br/>+ PostGIS 3.4"]
        REDIS["Redis 7<br/>(캐시 · 세션 · 큐)"]
        R2["Cloudflare R2<br/>(이미지 · 타일)"]
    end

    subgraph External["🌐 External APIs"]
        KMA["기상청 API<br/>(풍속 · 기온 · UV)"]
        OM["Open-Meteo<br/>(파고 · 너울 · 수온)"]
        KHOA["해양조사원<br/>(조석 · 조류)"]
        FCM["Firebase FCM<br/>(푸시 알림)"]
        NMAP["네이버 지도 API"]
        PAY["포트원 v2 +<br/>Apple/Google IAP"]
    end

    APP --> ALB
    ADMIN --> ALB
    WIDGET -.->|SharedPrefs/AppGroup| APP
    ALB --> NGINX --> API

    API --> PG
    API --> REDIS
    API --> R2
    API --> FCM
    API --> PAY

    WW --> KMA
    WW --> OM
    WW --> KHOA
    WW --> PG
    WW --> REDIS
    WW -->|이벤트| SE

    SE --> REDIS
    SE --> PG
    SE -->|이벤트| NW

    NW --> FCM
    NW --> PG

    TR --> OM
    TR --> R2

    APP --> NMAP
```

---

## 2. NestJS 모듈 구조

```mermaid
graph LR
    subgraph AppModule
        AUTH["AuthModule<br/>JWT · OAuth2"]
        USERS["UsersModule<br/>회원 CRUD"]
        SPOTS["SpotsModule<br/>스팟 · PostGIS"]
        WEATHER["WeatherModule<br/>기상 · 관측소"]
        SCORES["ScoresModule<br/>활동 지수"]
        ALERTS["AlertsModule<br/>알림 설정"]
        FAV["FavoritesModule<br/>즐겨찾기"]
        COMM["CommunityModule<br/>리포트 · 리뷰"]
        SREQ["SpotRequestsModule<br/>스팟 요청"]
        SUBS["SubscriptionsModule<br/>구독 · 결제"]
        ADM["AdminModule<br/>관리자 전용"]
        TILES["TilesModule<br/>(Phase 2)"]
        COMMON["CommonModule<br/>Guard · Pipe · Filter"]
        CONFIG["ConfigModule<br/>환경변수"]
    end

    AUTH --> USERS
    SPOTS --> WEATHER
    SCORES --> WEATHER
    ALERTS --> SCORES
    FAV --> SPOTS
    SREQ --> SPOTS
    ADM --> SPOTS
    ADM --> SREQ
    SUBS --> USERS
```

### 모듈별 담당 엔드포인트

| 모듈 | 엔드포인트 | 인증 |
|------|-----------|------|
| AuthModule | `POST /auth/kakao, /auth/apple, /auth/google, /auth/refresh` | 없음 |
| UsersModule | `GET/PATCH /users/me` | JWT |
| SpotsModule | `GET /spots, /spots/:id, /spots/near` | Public / Admin |
| WeatherModule | `GET /weather/:spotId/current, /forecast, /tides, /observation` | Public / Pro |
| ScoresModule | `GET /scores/:spotId, /scores/:spotId/timeline` | Public |
| AlertsModule | `GET/POST/DELETE /alerts` | JWT / Pro |
| FavoritesModule | `GET/POST/DELETE /favorites` | JWT |
| CommunityModule | `GET/POST /reports, /reviews` | Public / Pro |
| SpotRequestsModule | `POST /spot-requests` | Pro / Admin |
| SubscriptionsModule | `GET /subscriptions/me, POST /subscriptions/webhook` | JWT |
| AdminModule | 스팟 CRUD, 요청 승인/반려 | Admin |

---

## 3. 핵심 데이터 플로우

### 3.1 기상 데이터 수집 파이프라인

```mermaid
sequenceDiagram
    participant WW as Weather Worker
    participant KMA as 기상청 API
    participant OM as Open-Meteo
    participant KHOA as 해양조사원
    participant PG as PostgreSQL
    participant RD as Redis
    participant SE as Score Engine
    participant NW as Notification Worker

    Note over WW: Cron: 매 1시간

    WW->>PG: ① 활성 스팟 목록 로드
    WW->>WW: ② 좌표 클러스터링 (10km)

    par 외부 API 병렬 호출
        WW->>KMA: ③ 풍속·기온·강수·UV 요청
        WW->>OM: ④ 파고·파주기·너울·수온 요청
        WW->>KHOA: ⑤ 조석·조류 요청
    end

    WW->>RD: ⑥ 스팟별 최신 기상 캐시 (TTL 60분)
    WW->>PG: ⑦ weather_snapshots INSERT
    WW->>SE: ⑧ 수집 완료 이벤트

    SE->>RD: 기상 데이터 로드
    SE->>SE: 종목별 가중치 계산 (0~100점)
    SE->>SE: 안전 패널티 + 기상특보 체크
    SE->>RD: score:{spotId}:{sport} 캐시 (TTL 70분)
    SE->>PG: activity_scores INSERT
    SE->>NW: 지수 계산 완료 이벤트

    NW->>PG: 알림 대상 alert_settings 조회
    NW->>NW: 중복 방지 + 조용한 시간 체크
    NW->>FCM: FCM 발송
```

### 3.2 앱 → 서버 요청 플로우 (스팟 상세)

```mermaid
sequenceDiagram
    participant App as Flutter App
    participant API as NestJS API
    participant RD as Redis
    participant PG as PostgreSQL

    Note over App: 스팟 상세 화면 진입

    par 병렬 요청 (Future.wait)
        App->>API: GET /spots/:id
        App->>API: GET /weather/:id/current
        App->>API: GET /scores/:id?sport=surfing
    end

    API->>PG: 스팟 기본 정보 조회
    API->>RD: 기상 캐시 조회 (miss 시 PG fallback)
    API->>RD: 활동 지수 캐시 조회

    API-->>App: 스팟 정보 + 기상 + 지수 응답

    App->>API: GET /weather/:id/forecast
    API->>PG: activity_scores 7일치

    App->>API: GET /weather/:id/tides
    API->>PG: tides 오늘+3일

    opt Pro 사용자
        App->>API: GET /weather/:id/observation
        API->>PG: observation_snapshots 최신 1건
    end
```

### 3.3 소셜 로그인 + JWT 인증 플로우

```mermaid
sequenceDiagram
    participant App as Flutter App
    participant SDK as 카카오/애플/구글 SDK
    participant API as NestJS API
    participant RD as Redis

    App->>SDK: 소셜 로그인 요청
    SDK-->>App: Social Access Token 반환

    App->>API: POST /auth/{provider}<br/>{ socialToken }
    API->>SDK: 소셜 토큰 서버사이드 검증
    SDK-->>API: 유저 정보 (email, id)

    alt 신규 유저
        API->>API: users 테이블 INSERT
    else 기존 유저
        API->>API: users 테이블 조회
    end

    API->>API: JWT Access Token 생성 (1h)
    API->>RD: Refresh Token 저장 (30d)<br/>key: refresh:{userId}
    API-->>App: { accessToken, refreshToken }

    Note over App: 이후 요청마다<br/>Authorization: Bearer {accessToken}

    App->>API: 요청 (만료된 토큰)
    API-->>App: 401 AUTH_TOKEN_EXPIRED

    App->>API: POST /auth/refresh<br/>{ refreshToken }
    API->>RD: Refresh Token 검증
    API->>RD: 기존 토큰 무효화 + 새 토큰 저장
    API-->>App: { newAccessToken, newRefreshToken }
```

---

## 4. 캐싱 전략 (Redis)

| 키 패턴 | 데이터 | TTL | 용도 |
|---------|--------|-----|------|
| `weather:{spotId}` | 최신 기상 데이터 JSON | 60분 | 앱 현재 컨디션 API 응답 |
| `score:{spotId}:{sport}:{timestamp}` | 활동 지수 + 등급 | 70분 | 지수 API 응답 (다음 수집 전까지) |
| `refresh:{userId}` | Refresh Token (opaque) | 30일 | 인증 토큰 관리 |
| `alert_log:{spotId}:{grade}` | 발송 이력 | 24시간 | 알림 중복 방지 |
| `tile:latest` | 최신 타일 datetime | 1시간 | 앱 타일 레이어 polling |
| `rate:{ip}:{endpoint}` | 호출 카운트 | 1분 | Rate Limiting |

---

## 5. Guard 체계 (인증·인가)

```mermaid
graph TD
    REQ["HTTP 요청"] --> JG{"JwtAuthGuard"}

    JG -->|"@Public()"| PUBLIC["인증 불필요<br/>스팟 목록, 기상 등"]
    JG -->|"유효한 JWT"| AUTHED["인증됨"]
    JG -->|"만료/무효"| E401["401 AUTH_TOKEN_EXPIRED"]

    AUTHED --> PG{"ProGuard"}
    PG -->|"plan === 'pro'"| PRO["Pro 기능 접근<br/>관측소, 알림 빌더 등"]
    PG -->|"plan === 'free'"| E403P["403 PLAN_REQUIRED"]

    AUTHED --> AG{"AdminGuard"}
    AG -->|"role === 'admin'"| ADMIN["관리자 기능<br/>스팟 CRUD, 요청 검토"]
    AG -->|"role !== 'admin'"| E403A["403 AUTH_FORBIDDEN"]
```

---

## 6. 환경별 인프라 구성

| 환경 | 인프라 | DB | Redis |
|------|--------|-------|-------|
| **Development** | Docker Compose 로컬 | PostGIS 16 (Docker) | Redis 7 (Docker) |
| **Staging** | AWS ECS Fargate | RDS t3.micro | ElastiCache t3.micro |
| **Production** | AWS ECS Fargate (x2, Auto-scaling) | RDS t3.small+ | ElastiCache t3.small |

### Production 월 예상 비용: ~₩153,700

| 서비스 | 사양 | 비용 |
|--------|------|------|
| ECS Fargate (API) | 0.5 vCPU / 1GB × 2 Task | ~₩40,000 |
| ECS Fargate (Worker) | 0.25 vCPU / 0.5GB × 1 | ~₩15,000 |
| RDS PostgreSQL | db.t3.small | ~₩45,000 |
| ElastiCache Redis | cache.t3.small | ~₩25,000 |
| ALB + Route53 + S3 | Standard | ~₩28,700 |
