import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import appConfig from './config/app.config';

@Module({
  imports: [
    // 환경변수 설정 (전역)
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),

    // Rate Limiting: 일반 API 100건/분
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,    // 1분 (ms)
        limit: 100,    // 100건
      },
      {
        name: 'auth',
        ttl: 60000,
        limit: 10,     // 인증 API 10건/분
      },
    ]),

    // TODO: 각 기능 모듈 추가 예정
    // AuthModule, UsersModule, SpotsModule, WeatherModule,
    // ScoresModule, AlertsModule, FavoritesModule,
    // CommunityModule, SpotRequestsModule, SubscriptionsModule, AdminModule
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

