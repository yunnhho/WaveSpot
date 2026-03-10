# WAVESPOT Agent Rules

## 프로젝트 개요
- 한국 해양·수상 스포츠 컨디션 앱
- 플랫폼: iOS / Android (Flutter) + Admin Web (Next.js)
- 백엔드: NestJS + PostgreSQL(PostGIS) + Redis
- 인증: JWT + 소셜 OAuth2 (카카오, 애플, 구글)
- 결제: 포트원 v2 + Apple/Google IAP
- 지도: 네이버 지도 API

## 기술 규칙
- Flutter: Dart 3.x, Riverpod 상태관리, go_router 네비게이션
- NestJS: TypeScript strict mode, class-validator 데코레이터 검증
- DB: Prisma ORM + PostgreSQL(PostGIS), 마이그레이션 필수
- API: REST, 모든 엔드포인트는 JWT Guard 적용 (Public 제외)
- 캐싱: Redis (기상 데이터 TTL 60분, 활동 지수 TTL 70분)
- 환경변수: .env 파일 사용, 절대 하드코딩 금지

## 프로젝트 구조
- `apps/api/` — NestJS 백엔드 (TypeScript)
- `apps/mobile/` — Flutter 앱 (Dart)
- `apps/admin-web/` — Next.js 관리자 대시보드
- `packages/shared/` — 프론트·백 공유 타입/상수
- `infra/` — Docker, Terraform, 배포 스크립트
- `docs/` — 프로젝트 문서 (SRS, TDD)
- `document/` — 원본 기획 문서

## 코드 스타일
- TypeScript: ESLint + Prettier (세미콜론 있음, 싱글 쿼트)
- Dart: flutter_lints 패키지 기본 규칙
- 커밋 메시지: Conventional Commits (feat:, fix:, chore: 등)
- 파일명: kebab-case (예: spot-detail.screen.dart, create-spot.dto.ts)

## 보안 주의사항
- API Key, DB 비밀번호 등 민감 정보는 절대 코드에 포함하지 말 것
- 사용자 입력은 항상 검증 (class-validator + custom pipe)
- SQL Injection 방지: Prisma 파라미터 바인딩 사용, raw query 최소화
- CORS 설정: 프로덕션에서는 허용 도메인 명시적 지정
- JWT: flutter_secure_storage에 저장 (localStorage 절대 금지)
- 소셜 토큰: 반드시 서버사이드 검증 (클라이언트 측 검증만으로 처리 금지)

## 디자인 토큰
- Primary: #0C3B6E (Ocean Blue) — 헤더, CTA 버튼, 마커 테두리
- Accent: #07C0D4 (Wave Cyan) — 활성 탭, 하이라이트, 로딩
- Background Light: #F0EDE5 (Sea Sand) — 라이트 모드 배경
- Background Dark: #0D1B2A (Deep Ocean) — 다크 모드 배경
- Surface Light: #FFFFFF / Dark: #1A2E44 — 카드·바텀시트
- EXCELLENT: #10B981 (초록) / GOOD: #3B82F6 (파랑) / FAIR: #F59E0B (노랑) / POOR: #EF4444 (빨강)

## API 응답 규칙
- 성공: `{ "success": true, "data": {...}, "meta": {...} }`
- 에러: `{ "success": false, "error": { "code": "SPOT_NOT_FOUND", "message": "..." } }`
- 페이지네이션: `{ "success": true, "data": [...], "pagination": { "page", "limit", "total" } }`

## 참고 문서
- SRS: `document/WAVESPOT_SRS_v1_3.md`
- TDD: `document/WAVESPOT_TDD_v1_1.md`
- Setup Guide: `document/WAVESPOT_Antigravity_Setup_Guide.md`
