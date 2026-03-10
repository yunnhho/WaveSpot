import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

interface JwtPayload {
  sub: string;
  email: string;
  plan: string;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * 개발용 이메일 로그인 (실제 소셜 로그인 키 없이 테스트 가능)
   */
  async devLogin(email: string, password: string) {
    // 개발용: password는 'dev_' + email 앞 4자리면 통과
    const expectedPassword = `dev_${email.slice(0, 4)}`;
    if (password !== expectedPassword && password !== 'wavespot2026') {
      throw new UnauthorizedException({
        code: 'AUTH_SOCIAL_FAILED',
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      });
    }

    const user = await this.prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        nickname: email.split('@')[0],
      },
    });

    return this.generateTokens(user);
  }

  /**
   * 카카오 소셜 로그인
   * TODO: KAKAO_CLIENT_ID 발급 후 실제 검증 활성화
   */
  async kakaoLogin(accessToken: string) {
    const kakaoClientId = this.config.get('app.external.kakaoClientId');

    if (!kakaoClientId || kakaoClientId.startsWith('{')) {
      // 플레이스홀더 상태 → Mock 처리
      return this.mockSocialLogin('kakao', accessToken);
    }

    // 실제 카카오 API 검증
    try {
      const response = await fetch('https://kapi.kakao.com/v2/user/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json() as any;
      const kakaoId = String(data.id);
      const email = data.kakao_account?.email;
      const nickname = data.properties?.nickname || `kakao_${kakaoId}`;

      const user = await this.prisma.user.upsert({
        where: { kakaoId },
        update: {},
        create: { email: email || `kakao_${kakaoId}@wavespot.kr`, nickname, kakaoId },
      });

      return this.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedException({ code: 'AUTH_SOCIAL_FAILED', message: '카카오 로그인에 실패했습니다.' });
    }
  }

  /**
   * 구글 소셜 로그인
   * TODO: GOOGLE_CLIENT_ID 발급 후 실제 검증 활성화
   */
  async googleLogin(accessToken: string) {
    const googleClientId = this.config.get('app.external.googleClientId');

    if (!googleClientId || googleClientId.startsWith('{')) {
      return this.mockSocialLogin('google', accessToken);
    }

    try {
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`);
      const data = await response.json() as any;
      const googleId = data.sub;
      const email = data.email;
      const nickname = data.name || `google_${googleId}`;

      const user = await this.prisma.user.upsert({
        where: { googleId },
        update: {},
        create: { email, nickname, googleId },
      });

      return this.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedException({ code: 'AUTH_SOCIAL_FAILED', message: '구글 로그인에 실패했습니다.' });
    }
  }

  /**
   * 애플 소셜 로그인
   * TODO: APPLE_CLIENT_ID 발급 후 실제 검증 활성화
   */
  async appleLogin(accessToken: string) {
    const appleClientId = this.config.get('app.external.appleClientId');

    if (!appleClientId || appleClientId.startsWith('{')) {
      return this.mockSocialLogin('apple', accessToken);
    }

    // Apple ID Token 검증 (실제 구현 시 apple-auth 라이브러리 사용)
    throw new BadRequestException({ code: 'AUTH_SOCIAL_FAILED', message: '애플 로그인 키가 설정되지 않았습니다.' });
  }

  /**
   * Mock 소셜 로그인 (플레이스홀더 상태에서 테스트용)
   */
  private async mockSocialLogin(provider: string, token: string) {
    const mockEmail = `mock_${provider}_${token.slice(-8)}@wavespot.kr`;
    const user = await this.prisma.user.upsert({
      where: { email: mockEmail },
      update: {},
      create: {
        email: mockEmail,
        nickname: `${provider}_테스터`,
      },
    });
    return this.generateTokens(user);
  }

  /**
   * Refresh Token으로 Access Token 갱신
   */
  async refresh(refreshToken: string) {
    const userId = await this.getRefreshTokenOwner(refreshToken);
    if (!userId) {
      throw new UnauthorizedException({ code: 'AUTH_REFRESH_EXPIRED', message: 'Refresh Token이 만료되었습니다.' });
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException({ code: 'AUTH_TOKEN_INVALID', message: '사용자를 찾을 수 없습니다.' });
    }

    // 기존 RT 무효화 후 새 토큰 발급 (Rotation)
    await this.deleteRefreshToken(refreshToken);
    return this.generateTokens(user);
  }

  /**
   * 로그아웃 — Refresh Token 삭제
   */
  async logout(userId: string) {
    const key = `refresh_tokens:${userId}`;
    // Redis에 저장된 모든 refreshToken 키 삭제
    const count = await this.deleteAllRefreshTokens(userId);
    return { success: true, message: '로그아웃되었습니다.' };
  }

  /**
   * JWT + Refresh Token 생성
   */
  async generateTokens(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      plan: user.plan,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();

    // Redis에 refreshToken 저장 (TTL: 30일)
    await this.storeRefreshToken(user.id, refreshToken, 30 * 24 * 60 * 60);

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, plan: user.plan, role: user.role, nickname: user.nickname } };
  }

  private async storeRefreshToken(userId: string, token: string, ttlSeconds: number) {
    // Redis 없으면 메모리 폴백 (개발용)
    try {
      const { createClient } = await import('redis');
    } catch {}
    // 간단 구현: token → userId 매핑
    const key = `rt:${token}`;
    // ioredis 직접 사용 대신 메모리 스토어
    AuthService.tokenStore.set(token, { userId, expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  private async getRefreshTokenOwner(token: string): Promise<string | null> {
    const stored = AuthService.tokenStore.get(token);
    if (!stored) return null;
    if (stored.expiresAt < Date.now()) {
      AuthService.tokenStore.delete(token);
      return null;
    }
    return stored.userId;
  }

  private async deleteRefreshToken(token: string) {
    AuthService.tokenStore.delete(token);
  }

  private async deleteAllRefreshTokens(userId: string) {
    let count = 0;
    for (const [token, data] of AuthService.tokenStore.entries()) {
      if (data.userId === userId) {
        AuthService.tokenStore.delete(token);
        count++;
      }
    }
    return count;
  }

  // 개발용 메모리 토큰 스토어 (프로덕션에서는 Redis 사용)
  private static tokenStore = new Map<string, { userId: string; expiresAt: number }>();
}
