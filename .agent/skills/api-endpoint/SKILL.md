---
name: REST API Endpoint Generator
description: WAVESPOT REST API 엔드포인트 생성 시 따라야 할 규칙과 응답 형식
---

# REST API 엔드포인트 생성 스킬

새 API 엔드포인트를 만들 때 항상 아래 규칙을 따르세요.

## 응답 형식 (필수)

모든 API 응답은 아래 형식을 따릅니다.

### 성공 응답
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "cachedAt": "2026-03-09T12:00:00Z",
    "source": "redis"
  }
}
```

### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "SPOT_NOT_FOUND",
    "message": "스팟을 찾을 수 없습니다."
  }
}
```

### 페이지네이션 응답
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

## 인증 Guard 체계

| Guard | 데코레이터 | 용도 |
|-------|-----------|------|
| 없음 (Public) | `@Public()` | 인증 불필요 (스팟 목록, 현재 기상) |
| JWT | `@UseGuards(JwtAuthGuard)` | 로그인 사용자 (즐겨찾기, 알림 설정) |
| ProGuard | `@UseGuards(ProGuard)` | Pro 구독자 전용 (관측소 데이터, 알림 빌더) |
| AdminGuard | `@UseGuards(AdminGuard)` | 관리자 전용 (스팟 CRUD, 요청 검토) |

## 에러 코드 체계

에러 코드는 도메인별 접두사를 사용합니다:
- `AUTH_*` — 인증 관련 (401, 403)
- `PLAN_*` — 구독 플랜 관련 (403)
- `SPOT_*` — 스팟 관련 (400, 404, 409, 429)
- `WEATHER_*` — 기상 데이터 관련 (200 경고, 404, 503)
- `RATE_*` — Rate Limit (429)
- `SERVER_*` — 서버 내부 (500, 503)

## DTO 검증 규칙

```typescript
// 반드시 class-validator 데코레이터 사용
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class FindNearSpotsDto {
  @IsNumber()
  @Min(-90) @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180) @Max(180)
  lng: number;

  @IsNumber()
  @IsOptional()
  @Min(1) @Max(100)
  radius?: number = 30; // km, 기본 30km
}
```

## Rate Limiting 기준

| 엔드포인트 그룹 | 제한 | 기준 |
|----------------|------|------|
| 일반 API (GET) | 100건/분 | IP |
| 인증 API (POST /auth/*) | 10건/분 | IP |
| 이미지 업로드 | 20건/시간 | 유저 |
| 스팟 추가 요청 | 3건/일 | Pro 유저 |

## 엔드포인트 작성 절차

1. **DTO 정의** — `dto/` 폴더에 요청 검증 DTO 작성
2. **Service 로직** — 비즈니스 로직 구현 (Prisma/Redis 접근)
3. **Controller 라우트** — HTTP 메서드 + 경로 매핑
4. **Guard 적용** — 인증 수준에 맞는 Guard 데코레이터 추가
5. **테스트 작성** — Service 단위 테스트 (Jest)
6. **Swagger 문서** — `@ApiTags`, `@ApiOperation`, `@ApiResponse` 추가
