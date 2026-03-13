import * as Joi from 'joi';

/**
 * 환경변수 Joi 유효성 검증 스키마
 *
 * - 필수값이 없으면 서버 기동 즉시 오류로 실패 (보안)
 * - JWT_SECRET은 최소 32자 이상 강제
 * - 소셜/외부 API 키는 optional (플레이스홀더 허용)
 */
export const envValidationSchema = Joi.object({
  // 서버
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  APP_PORT: Joi.number().port().default(3000),

  // 데이터베이스
  DATABASE_URL: Joi.string().uri({ scheme: ['postgresql', 'postgres'] }).required(),

  // Redis
  REDIS_URL: Joi.string().required().default('redis://localhost:6379'),

  // JWT — 최소 32자, 프로덕션에서 플레이스홀더 거부
  JWT_SECRET: Joi.string()
    .min(32)
    .invalid('CHANGE_ME_USE_OPENSSL_RAND_BASE64_48_MIN_32_CHARS')
    .required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('30d'),

  // 소셜 로그인 (optional — 플레이스홀더 허용)
  KAKAO_CLIENT_ID: Joi.string().optional(),
  GOOGLE_CLIENT_ID: Joi.string().optional(),
  APPLE_CLIENT_ID: Joi.string().optional(),
  APPLE_TEAM_ID: Joi.string().optional(),
  APPLE_KEY_ID: Joi.string().optional(),

  // 기상청 / 해양조사원 (optional)
  KMA_API_KEY: Joi.string().optional(),
  KHOA_API_KEY: Joi.string().optional(),

  // 네이버 지도 (optional)
  NAVER_MAP_CLIENT_ID: Joi.string().optional(),
  NAVER_MAP_CLIENT_SECRET: Joi.string().optional(),

  // Firebase Admin SDK (optional)
  FIREBASE_PROJECT_ID: Joi.string().optional(),
  FIREBASE_CLIENT_EMAIL: Joi.string().email().optional(),
  FIREBASE_PRIVATE_KEY: Joi.string().optional(),

  // 포트원 (optional)
  PORTONE_API_KEY: Joi.string().optional(),
  PORTONE_WEBHOOK_SECRET: Joi.string().optional(),

  // Cloudflare R2 (optional)
  R2_ACCOUNT_ID: Joi.string().optional(),
  R2_ACCESS_KEY: Joi.string().optional(),
  R2_SECRET_KEY: Joi.string().optional(),
  R2_BUCKET_NAME: Joi.string().default('wavespot-media'),

  // 관리자 IP 화이트리스트
  ADMIN_IP_WHITELIST: Joi.string().default('127.0.0.1'),
});
