import { registerAs } from '@nestjs/config';

/**
 * WAVESPOT 앱 설정 (환경변수 기반)
 *
 * 사용: ConfigModule.forRoot({ load: [appConfig] })
 * 접근: this.configService.get('app.port')
 */
export default registerAs('app', () => ({
  // === 서버 ===
  port: parseInt(process.env.APP_PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // === 데이터베이스 ===
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // === JWT ===
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  },

  // === 소셜 로그인 ===
  social: {
    kakaoClientId: process.env.KAKAO_CLIENT_ID,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    appleClientId: process.env.APPLE_CLIENT_ID,
    appleTeamId: process.env.APPLE_TEAM_ID,
    appleKeyId: process.env.APPLE_KEY_ID,
  },

  // === 외부 API ===
  external: {
    kmaApiKey: process.env.KMA_API_KEY,
    khoaApiKey: process.env.KHOA_API_KEY,
    naverMapClientId: process.env.NAVER_MAP_CLIENT_ID,
    naverMapClientSecret: process.env.NAVER_MAP_CLIENT_SECRET,
    // 하위 호환성을 위해 기존 키 유지
    kakaoClientId: process.env.KAKAO_CLIENT_ID,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    appleClientId: process.env.APPLE_CLIENT_ID,
  },

  // === Firebase Admin SDK (FCM) ===
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },

  // === 포트원 v2 (결제) ===
  portone: {
    apiKey: process.env.PORTONE_API_KEY,
    webhookSecret: process.env.PORTONE_WEBHOOK_SECRET,
  },

  // === 스토리지 (Cloudflare R2) ===
  storage: {
    r2AccountId: process.env.R2_ACCOUNT_ID,
    r2AccessKey: process.env.R2_ACCESS_KEY,
    r2SecretKey: process.env.R2_SECRET_KEY,
    r2BucketName: process.env.R2_BUCKET_NAME || 'wavespot-media',
  },

  // === 관리자 보안 ===
  admin: {
    ipWhitelist: process.env.ADMIN_IP_WHITELIST?.split(',').map((ip) => ip.trim()) ?? ['127.0.0.1'],
  },
}));
