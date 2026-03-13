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

  // === 외부 API ===
  external: {
    kmaApiKey: process.env.KMA_API_KEY, // 기상청
    khoaApiKey: process.env.KHOA_API_KEY, // 국립해양조사원
    naverMapClientId: process.env.NAVER_MAP_CLIENT_ID,
    naverMapClientSecret: process.env.NAVER_MAP_CLIENT_SECRET,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    portoneApiKey: process.env.PORTONE_API_KEY,
  },

  // === 스토리지 (Cloudflare R2) ===
  storage: {
    r2AccountId: process.env.R2_ACCOUNT_ID,
    r2AccessKey: process.env.R2_ACCESS_KEY,
    r2SecretKey: process.env.R2_SECRET_KEY,
    r2BucketName: process.env.R2_BUCKET_NAME || 'wavespot-media',
  },
}));
