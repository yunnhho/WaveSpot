import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('app.jwt.secret');
        // Joi validationSchema에서 이미 검증됐지만 이중 방어
        if (!secret || secret.length < 32) {
          throw new Error(
            'JWT_SECRET이 설정되지 않았거나 32자 미만입니다. apps/api/.env를 확인하세요.',
          );
        }
        return {
          secret,
          signOptions: {
            expiresIn: config.get('app.jwt.expiresIn') || '1h',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
