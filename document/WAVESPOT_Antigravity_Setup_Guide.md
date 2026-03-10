# 🌊 WAVESPOT × Google Antigravity + Claude 세팅 가이드

> **대상**: WAVESPOT 프로젝트 (Flutter + NestJS + PostgreSQL)
> **도구**: Google Antigravity IDE + Claude (Extensions)
> **작성일**: 2026-03-09

---

## 1. Google Antigravity란?

Google Antigravity는 2025년 11월에 출시된 **에이전트 중심(Agent-first) 개발 플랫폼**입니다. VS Code를 기반으로 만들어졌지만, AI 에이전트가 코드 작성·터미널 실행·브라우저 테스트까지 자율적으로 수행할 수 있는 것이 핵심 차이점입니다.

**WAVESPOT에 적합한 이유:**
- Flutter(Dart), NestJS(TypeScript), SQL 등 다중 언어 프로젝트를 에이전트가 파일 간 이동하며 작업 가능
- 브라우저 내장으로 Admin Web(Next.js) 실시간 테스트 가능
- 멀티 에이전트로 프론트/백엔드 병렬 작업 가능

---

## 2. 설치 및 초기 세팅

### 2.1 Antigravity 다운로드 & 설치

1. **공식 사이트 접속**: [https://antigravity.google](https://antigravity.google)
2. **OS에 맞는 설치 파일 다운로드** (macOS / Windows / Linux 모두 지원)
3. **설치 파일 실행** 후 일반 애플리케이션처럼 설치

### 2.2 최초 실행 시 온보딩 설정

Antigravity를 처음 실행하면 몇 가지 설정 화면이 나옵니다. 아래 순서대로 진행하세요.

**① 기존 설정 가져오기 (Import)**
- VS Code나 Cursor를 사용 중이었다면 → 해당 설정 import 선택
- 처음이라면 → **"Start fresh"** 선택 후 Next

**② 테마 선택**
- Light / Dark / Auto 중 선택 (WAVESPOT은 다크모드도 지원하므로 Dark 추천)

**③ Agent 개발 모드 선택 (중요!)**

| 모드 | 설명 | 추천 상황 |
|------|------|-----------|
| Agent-driven | AI가 자율적으로 코드 작성·실행 (자동 조종) | 빠른 프로토타이핑 |
| **Agent-assisted** | **AI가 도와주되, 개발자가 제어권 유지 (추천!)** | **실제 프로젝트 개발** |
| Review-driven | AI가 모든 행동 전에 허가 요청 | 보안 민감한 작업 |

> 💡 **WAVESPOT 추천**: **Agent-assisted** 모드
> - 결제(포트원), 인증(JWT/OAuth) 등 민감한 코드가 포함되므로, AI가 마음대로 실행하지 않고 개발자 확인을 거치는 것이 안전합니다.
> - 나중에 언제든 변경 가능합니다.

**④ Terminal Policy**: **Auto** (일반 명령은 자동 실행, 위험한 명령은 확인 요청)

**⑤ Review Policy**: **Agent Decides** (에이전트가 중요도에 따라 리뷰 요청 여부 판단)

**⑥ Google 계정 로그인**
- 브라우저가 열리며 Google OAuth 인증 진행
- 개인 Gmail 계정으로 로그인 (현재 Public Preview로 **무료** 사용 가능)

---

## 3. Claude 모델 설정 (핵심!)

Antigravity는 기본적으로 Gemini 3 Pro가 설정되어 있습니다. Claude로 변경하는 방법은 다음과 같습니다.

### 3.1 내장 모델 드롭다운에서 변경하기

1. Antigravity 좌측 하단 또는 Agent 패널 상단의 **모델 선택 드롭다운** 클릭
2. 사용 가능한 모델 목록에서 Claude 모델 선택:
   - **Claude Sonnet 4.6** — 빠른 코딩 작업에 적합 (무료 제공)
   - **Claude Sonnet 4.6 (Thinking)** — 복잡한 설계/아키텍처 작업에 추천
   - **Claude Opus 4.6 (Thinking)** — 가장 높은 추론 능력 (사용량 제한 있음)

> ⚠️ **주의**: Claude 모델은 Google의 자체 모델이 아니므로, 무료 프리뷰에서 제공 방식이 다를 수 있습니다. 만약 드롭다운에 Claude가 없다면, 아래 3.2 방법을 사용하세요.

### 3.2 Settings에서 API Key 직접 등록하기

드롭다운에서 Claude 모델이 보이지 않거나, 본인의 Anthropic API Key를 사용하고 싶다면:

1. **Settings 열기**: `Ctrl + ,` (Windows/Linux) 또는 `Cmd + ,` (macOS)
2. **Settings > AI > Models** 로 이동
3. **Claude Sonnet 4.6** (또는 원하는 모델) 선택
4. **Anthropic API Key 입력**: `sk-ant-...` 형태의 키 붙여넣기
   - API Key는 [Anthropic Console](https://console.anthropic.com)에서 발급
   - Key는 OS의 Secure Keychain에 저장되므로 보안 걱정은 적음

> 💡 **WAVESPOT 프로젝트 추천 모델 조합**:
> - **일반 코딩 (Flutter UI, NestJS API)**: Claude Sonnet 4.6 — 속도와 품질 균형
> - **아키텍처 설계, DB 스키마 리뷰**: Claude Sonnet 4.6 (Thinking) — 깊은 추론
> - **빠른 프로토타이핑, 디자인 시안**: Gemini 3 Pro — UI 생성 품질 우수

---

## 4. WAVESPOT 프로젝트 워크스페이스 구성

### 4.1 프로젝트 폴더 구조 만들기

Antigravity에서 **File > Open Folder**로 프로젝트 루트 폴더를 엽니다.

```
wavespot/
├── apps/
│   ├── mobile/          # Flutter 앱 (iOS·Android)
│   ├── admin-web/       # Next.js 관리자 대시보드
│   └── api/             # NestJS 백엔드 서버
├── packages/
│   └── shared/          # 프론트·백 공유 타입/상수
├── infra/
│   ├── docker/          # Docker Compose (개발 환경)
│   ├── terraform/       # AWS 인프라 코드 (선택)
│   └── scripts/         # 배포·마이그레이션 스크립트
├── docs/
│   ├── SRS_v1_3.md      # 요구사항 명세서
│   └── TDD_v1_1.md      # 기술 설계 문서
├── .agent/
│   ├── rules.md         # Antigravity 에이전트 규칙 (아래 4.3 참조)
│   └── skills/          # 커스텀 스킬 폴더 (아래 4.4 참조)
├── docker-compose.yml
├── package.json         # 모노레포 루트 (pnpm/yarn workspace)
└── README.md
```

### 4.2 개발 환경 Docker Compose (로컬)

프로젝트 루트에 `docker-compose.yml`을 만들어 PostgreSQL + Redis를 한 번에 띄웁니다.

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:16-3.4
    container_name: wavespot-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: wavespot
      POSTGRES_PASSWORD: wavespot_dev_2026
      POSTGRES_DB: wavespot
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: wavespot-redis
    ports:
      - "6379:6379"
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

volumes:
  pgdata:
```

> 💡 **PostGIS를 사용하는 이유**: WAVESPOT은 스팟 위치 기반 반경 검색(`/spots/near?lat&lng&radius`)이 핵심이므로, PostgreSQL에 PostGIS 확장이 필수입니다. 일반 PostgreSQL 이미지 대신 `postgis/postgis` 이미지를 사용하세요.

### 4.3 에이전트 규칙 파일 설정 (.agent/rules.md)

Antigravity의 에이전트가 WAVESPOT 프로젝트 맥락을 이해하도록 규칙을 작성합니다. 이 파일이 있으면 에이전트가 매번 프로젝트 구조를 파악할 필요 없이 일관된 작업이 가능합니다.

```markdown
# WAVESPOT Agent Rules

## 프로젝트 개요
- 한국 해양·수상 스포츠 컨디션 앱
- 플랫폼: iOS / Android (Flutter) + Admin Web (Next.js)
- 백엔드: NestJS + PostgreSQL(PostGIS) + Redis
- 인증: JWT + 소셜 OAuth2 (카카오, 애플, 구글)
- 결제: 포트원 v2 + Apple/Google IAP

## 기술 규칙
- Flutter: Dart 3.x, Riverpod 상태관리, go_router 네비게이션
- NestJS: TypeScript strict mode, class-validator 데코레이터 검증
- DB: TypeORM + PostgreSQL, 마이그레이션 필수
- API: REST, 모든 엔드포인트는 JWT Guard 적용 (Public 제외)
- 환경변수: .env 파일 사용, 절대 하드코딩 금지

## 코드 스타일
- TypeScript: ESLint + Prettier (세미콜론 있음, 싱글 쿼트)
- Dart: flutter_lints 패키지 기본 규칙
- 커밋 메시지: Conventional Commits (feat:, fix:, chore: 등)
- 파일명: kebab-case (예: spot-detail.screen.dart)

## 보안 주의사항
- API Key, DB 비밀번호 등 민감 정보는 절대 코드에 포함하지 말 것
- 사용자 입력은 항상 검증 (class-validator + custom pipe)
- SQL Injection 방지: TypeORM 쿼리빌더 또는 파라미터 바인딩 사용
- CORS 설정: 프로덕션에서는 허용 도메인 명시적 지정

## 디자인 토큰
- Primary: #0C3B6E (Ocean Blue)
- Accent: #07C0D4 (Wave Cyan)
- Background Light: #F0EDE5 (Sea Sand)
- Background Dark: #0D1B2A (Deep Ocean)
- EXCELLENT: #10B981 / GOOD: #3B82F6 / FAIR: #F59E0B / POOR: #EF4444
```

### 4.4 커스텀 스킬 설정 (.agent/skills/)

에이전트가 반복적인 패턴을 자동으로 따르도록 스킬을 만들 수 있습니다.

```
.agent/skills/
├── nestjs-module/
│   └── SKILL.md          # NestJS 모듈 생성 패턴
├── flutter-screen/
│   └── SKILL.md          # Flutter 화면 생성 패턴
└── api-endpoint/
    └── SKILL.md          # REST API 엔드포인트 생성 패턴
```

**예시 — `.agent/skills/nestjs-module/SKILL.md`**:

```markdown
# NestJS 모듈 생성 스킬

새 모듈을 만들 때 항상 아래 구조를 따르세요:

## 파일 구조
apps/api/src/{module-name}/
├── {module-name}.module.ts
├── {module-name}.controller.ts
├── {module-name}.service.ts
├── dto/
│   ├── create-{name}.dto.ts
│   └── update-{name}.dto.ts
├── entities/
│   └── {name}.entity.ts
└── __tests__/
    └── {module-name}.service.spec.ts

## 규칙
- Entity는 TypeORM @Entity 데코레이터 사용
- DTO는 class-validator 데코레이터로 검증
- Service에 비즈니스 로직 집중, Controller는 얇게 유지
- 모든 Public 메서드에 JSDoc 주석 작성
```

---

## 5. 브라우저 확장 프로그램(Extension) 설치

### 5.1 Antigravity Chrome Extension

에이전트가 브라우저를 직접 조작해서 Admin Web을 테스트하려면 Chrome Extension이 필요합니다.

1. Agent Manager에서 **브라우저 아이콘(Chrome 아이콘)** 클릭
2. **"Setup"** 버튼 클릭 → Chrome Web Store로 이동
3. **Antigravity Extension 설치**
4. 설치 완료 후 Antigravity로 돌아오면 브라우저 에이전트가 활성화됨

> 💡 **활용 예시**: "Admin Web에서 스팟 CRUD 화면을 만들고, 브라우저에서 실제로 스팟을 추가해서 동작 확인해줘"라고 에이전트에게 요청하면, 에이전트가 코드 작성 → 서버 실행 → 브라우저에서 테스트 → 스크린샷 캡처까지 자동으로 수행합니다.

### 5.2 추천 VS Code 확장 (Antigravity 내 Extensions 탭)

Antigravity는 VS Code 기반이므로, Extensions 마켓플레이스에서 아래 확장을 설치하세요:

| 확장 | 용도 |
|------|------|
| **Flutter** (Dart Code) | Flutter/Dart 개발 필수 |
| **Dart** | Dart 언어 지원 |
| **ESLint** | TypeScript 린팅 |
| **Prettier** | 코드 포맷팅 |
| **Thunder Client** 또는 **REST Client** | API 테스트 |
| **PostgreSQL** (ckolkman) | DB 쿼리 직접 실행 |
| **Docker** | Docker Compose 관리 |
| **GitLens** | Git 히스토리 추적 |
| **Error Lens** | 에러를 인라인으로 표시 |
| **Korean Language Pack** | 한국어 UI (선택) |

**설치 방법**: 좌측 사이드바 Extensions 아이콘(□ 모양) 클릭 → 검색 → Install

---

## 6. 프로젝트 초기화 순서

Antigravity가 세팅되었으면, 아래 순서로 프로젝트를 초기화합니다.

### Step 1: 개발 환경 실행
```bash
# 프로젝트 루트에서
docker-compose up -d

# DB, Redis 연결 확인
docker-compose ps
```

### Step 2: NestJS 백엔드 초기화
```bash
cd apps/api
npx @nestjs/cli new . --package-manager pnpm --skip-git
pnpm add @nestjs/typeorm typeorm pg
pnpm add @nestjs/config @nestjs/jwt @nestjs/passport
pnpm add class-validator class-transformer
pnpm add passport passport-jwt
pnpm add ioredis @nestjs/bull
```

### Step 3: Flutter 앱 초기화
```bash
cd apps/mobile
flutter create . --org com.wavespot --project-name wavespot
flutter pub add flutter_riverpod
flutter pub add go_router
flutter pub add dio
flutter pub add naver_map_plugin  # 네이버 지도
flutter pub add shared_preferences
flutter pub add flutter_secure_storage
```

### Step 4: Admin Web 초기화
```bash
cd apps/admin-web
npx create-next-app . --typescript --tailwind --app --src-dir
pnpm add axios react-query
```

---

## 7. Antigravity 에이전트 활용 팁

### 7.1 Editor View vs Agent Manager View

| 뷰 | 단축키 | 사용 상황 |
|----|--------|-----------|
| **Editor View** | 기본 | 직접 코드 수정, 디버깅, 세부 조정 |
| **Agent Manager View** | `Ctrl/Cmd + Shift + M` | 에이전트에게 큰 작업 위임, 병렬 작업 관리 |

### 7.2 에이전트에게 작업 요청하는 좋은 프롬프트 예시

**나쁜 예시** (너무 모호):
> "WAVESPOT 백엔드 만들어줘"

**좋은 예시** (구체적 + 맥락 제공):
> "apps/api에 SpotsModule을 만들어줘. 
> docs/TDD_v1_1.md의 SpotsModule 스펙을 참고해서:
> 1. spots.entity.ts에 PostGIS의 Point 타입으로 location 컬럼 포함
> 2. GET /spots (필터: sport_types, region), GET /spots/:id, GET /spots/near?lat&lng&radius 엔드포인트
> 3. 반경 검색은 PostGIS ST_DWithin 사용
> 4. DTO에 class-validator 적용
> 5. 유닛 테스트 포함"

### 7.3 Plan 모드 vs Fast 모드

- **Plan 모드**: 복잡한 작업 시 에이전트가 먼저 계획(Plan Artifact)을 세우고, 개발자 확인 후 실행. DB 스키마 설계, 아키텍처 변경 등에 사용 추천.
- **Fast 모드**: 간단한 수정 시 즉시 실행. 버그 수정, 스타일 변경 등에 사용.

---

## 8. 예상되는 문제점 및 대응 방안

### 8.1 Rate Limit (사용량 제한)

| 상황 | 증상 | 대응 |
|------|------|------|
| Claude 모델 과다 사용 | "Rate limit exceeded" 에러 | Gemini 3 Pro로 임시 전환, 또는 5시간 대기 후 쿼터 갱신 |
| Free 계정 일일 한도 초과 | 에이전트 응답 중단 | Google AI Ultra 플랜 업그레이드 또는 Anthropic API Key 직접 등록 |

### 8.2 에이전트 동작 불안정

| 상황 | 대응 |
|------|------|
| 에이전트가 엉뚱한 파일 수정 | `.agent/rules.md`에 "수정 전 반드시 확인 요청" 규칙 추가 |
| 코드 스타일 불일치 | `.agent/rules.md`에 코드 컨벤션 명시 + ESLint/Prettier 설정 |
| 에이전트 무한 루프 | 작업 중단(Stop) → 새 대화(New Conversation) 시작 |
| 모델 전환 후 컨텍스트 손실 | 대화를 새로 시작하되, docs/ 폴더의 문서를 참조하도록 요청 |

### 8.3 Flutter + NestJS 동시 개발 시 주의

- **포트 충돌**: NestJS 기본 3000, Flutter 웹 기본 5000번 포트. 충돌 시 `--port` 옵션으로 변경.
- **CORS**: 개발 중 Flutter 웹에서 NestJS 호출 시 CORS 에러 발생 가능. NestJS `main.ts`에 `app.enableCors()` 필요.
- **핫 리로드 충돌**: Flutter와 NestJS 둘 다 핫 리로드를 사용하므로, 파일 변경 감시(watch) 충돌 가능. 각 앱을 별도 터미널에서 실행 권장.

### 8.4 보안 관련 주의사항

- Antigravity 에이전트는 터미널 명령을 실행할 수 있으므로, **Deny List**에 위험한 명령 추가:
  - `rm -rf /` → 시스템 파괴 방지
  - `git push --force` → 강제 푸시 방지
  - `DROP DATABASE` → DB 삭제 방지
- 설정 위치: **Settings > Agent > Terminal > Deny List Terminal Commands**

---

## 9. 체크리스트: 세팅 완료 확인

- [ ] Google Antigravity 설치 및 Google 계정 로그인
- [ ] Agent 모드: Agent-assisted 설정
- [ ] AI 모델: Claude Sonnet 4.6 (또는 Thinking) 선택
- [ ] Chrome Extension 설치 (브라우저 에이전트용)
- [ ] Flutter, Dart, ESLint, Prettier 등 VS Code 확장 설치
- [ ] 프로젝트 폴더 구조 생성 (`wavespot/` 루트)
- [ ] `.agent/rules.md` 작성 (프로젝트 규칙)
- [ ] `docker-compose.yml` 작성 (PostgreSQL + Redis)
- [ ] `docker-compose up -d` 실행 확인
- [ ] NestJS / Flutter / Next.js 각 앱 초기화
- [ ] Terminal Deny List에 위험 명령 등록

---

## 10. 다음 단계

세팅이 완료되면 아래 순서로 개발을 진행하는 것을 추천합니다:

1. **DB 스키마 마이그레이션** — TDD 문서의 테이블 설계를 TypeORM Entity로 변환
2. **AuthModule 구현** — 카카오/애플/구글 소셜 로그인 + JWT
3. **SpotsModule 구현** — 스팟 CRUD + PostGIS 반경 검색
4. **WeatherModule 구현** — 기상 데이터 수집 파이프라인
5. **Flutter 지도 화면** — 네이버 지도 + 스팟 마커 표시
6. **ScoreEngine** — 활동 지수 계산 로직

> 💡 각 단계에서 Antigravity 에이전트에게 TDD/SRS 문서(`docs/` 폴더)를 참조하도록 요청하면, 프로젝트 맥락을 이해한 상태에서 코드를 생성합니다.
