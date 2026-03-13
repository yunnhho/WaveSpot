import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '@nestjs-modules/ioredis';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import appConfig from './config/app.config';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    // 환경변수 설정 (전역) + Joi 유효성 검증
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),

    // Redis 모듈 (전역) — Refresh Token 저장소
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: config.get<string>('app.redis.url') || 'redis://localhost:6379',
        options: {
          lazyConnect: true,
          retryStrategy: (times: number) => {
            if (times > 3) return null; // 3회 실패 시 연결 포기
            return Math.min(times * 200, 2000);
          },
        },
      }),
    }),

    // Rate Limiting: TDD 4.4 기준
    // - 일반 API: 100건/분 (IP 기준)
    // - 인증 API: 10건/분 (IP 기준, 브루트포스 방지)
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'auth',
        ttl: 60000,
        limit: 10,
      },
    ]),

    // 기능 모듈
    PrismaModule,
    AuthModule,
    UsersModule,

    // TODO: 다음 모듈들은 구현 시 추가
    // SpotsModule,
    // WeatherModule,
    // ScoresModule,
    // AlertsModule,
    // FavoritesModule,
    // CommunityModule,
    // SpotRequestsModule,
    // SubscriptionsModule,
    // AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // JWT Guard 전역 등록 (@Public() 있으면 스킵)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
