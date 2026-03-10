# 🌊 WAVESPOT

> 한국 해양·수상 스포츠 컨디션 앱

한국 해안 및 내수면의 수상 스포츠 스팟에 대한 기상·해양 데이터를 분석하여 종목별 활동 가능 지수를 제공하는 모바일 앱입니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| 모바일 앱 | Flutter (Dart) — iOS · Android |
| 백엔드 API | NestJS (TypeScript) |
| 관리자 웹 | Next.js 14 (App Router) |
| DB | PostgreSQL 16 + PostGIS 3.4 |
| 캐싱 | Redis 7 |
| 인증 | JWT + OAuth2 (카카오 · 애플 · 구글) |
| 결제 | 포트원 v2 + Apple/Google IAP |
| 지도 | 네이버 지도 API |
| 파일 저장 | Cloudflare R2 |

## 프로젝트 구조

```
wavespot/
├── apps/
│   ├── mobile/          # Flutter 앱 (iOS·Android)
│   ├── admin-web/       # Next.js 관리자 대시보드
│   └── api/             # NestJS 백엔드 서버
├── packages/
│   └── shared/          # 프론트·백 공유 타입/상수
├── infra/
│   ├── docker/          # Docker 관련 설정
│   ├── terraform/       # AWS 인프라 코드
│   └── scripts/         # 배포·마이그레이션 스크립트
├── docs/                # 프로젝트 문서
├── document/            # 원본 기획 문서 (SRS, TDD)
├── .agent/              # Antigravity 에이전트 규칙 및 스킬
├── docker-compose.yml   # 로컬 개발 환경 (PostGIS + Redis)
└── .env.example         # 환경변수 템플릿
```

## 로컬 개발 환경 실행

### 1. Docker 실행 (PostgreSQL + Redis)
```bash
docker-compose up -d
docker-compose ps    # 컨테이너 상태 확인
```

### 2. NestJS 백엔드
```bash
cd apps/api
cp ../../.env.example .env   # 환경변수 설정
pnpm install
npx prisma migrate dev
pnpm run start:dev           # http://localhost:3000
```

### 3. Flutter 앱
```bash
cd apps/mobile
flutter pub get
flutter run
```

### 4. Admin Web
```bash
cd apps/admin-web
pnpm install
pnpm run dev                 # http://localhost:3001
```

## 브랜드 컬러

| 컬러명 | HEX | 용도 |
|--------|-----|------|
| Ocean Blue | `#0C3B6E` | Primary — 헤더, CTA 버튼 |
| Wave Cyan | `#07C0D4` | Accent — 활성 탭, 하이라이트 |
| Sea Sand | `#F0EDE5` | Background — 라이트 모드 배경 |

## 참고 문서

- [요구사항 명세서 (SRS v1.3)](document/WAVESPOT_SRS_v1_3.md)
- [기술 설계 문서 (TDD v1.1)](document/WAVESPOT_TDD_v1_1.md)
- [Antigravity 세팅 가이드](document/WAVESPOT_Antigravity_Setup_Guide.md)
