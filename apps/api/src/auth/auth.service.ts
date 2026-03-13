import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
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
    @InjectRedis() private readonly redis: Redis,
  ) {}

  /**
   * 개발용 이메일 로그인 (실제 소셜 로그인 키 없이 테스트 가능)
   * NODE_ENV=production에서는 비활성화
   */
  async devLogin(email: string, password: string) {
    if (this.config.get('app.nodeEnv') === 'production') {
      throw new BadRequestException({
        code: 'AUTH_SOCIAL_FAILED',
        message: '개발용 로그인은 프로덕션에서 사용할 수 없습니다.',
      });
    }

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
   * KAKAO_CLIENT_ID 발급 후 플레이스홀더({KAKAO_CLIENT_ID}) 교체 시 실제 검증 활성화
   */
  async kakaoLogin(accessToken: string) {
    const kakaoClientId = this.config.get<string>('app.social.kakaoClientId');

    if (!kakaoClientId || kakaoClientId.startsWith('{')) {
      // 플레이스홀더 상태 → 개발용 Mock 처리
      this.logger.warn('KAKAO_CLIENT_ID가 설정되지 않아 Mock 로그인 처리됩니다.');
      return this.mockSocialLogin('kakao', accessToken);
    }

    try {
      const response = await fetch('https://kapi.kakao.com/v2/user/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error(`Kakao API error: ${response.status}`);
      }

      const data = await response.json() as any;
      const kakaoId = String(data.id);
      const email = data.kakao_account?.email;
      const nickname = data.properties?.nickname || `kakao_${kakaoId}`;

      const user = await this.prisma.user.upsert({
        where: { kakaoId },
        update: {},
        create: {
          email: email || `kakao_${kakaoId}@wavespot.kr`,
          nickname,
          kakaoId,
        },
      });

      return this.generateTokens(user);
    } catch (e) {
      this.logger.error(`Kakao login failed: ${e.message}`);
      throw new UnauthorizedException({
        code: 'AUTH_SOCIAL_FAILED',
        message: '카카오 로그인에 실패했습니다.',
      });
    }
  }

  /**
   * 구글 소셜 로그인
   * GOOGLE_CLIENT_ID 발급 후 플레이스홀더 교체 시 실제 검증 활성화
   */
  async googleLogin(accessToken: string) {
    const googleClientId = this.config.get<string>('app.social.googleClientId');

    if (!googleClientId || googleClientId.startsWith('{')) {
      this.logger.warn('GOOGLE_CLIENT_ID가 설정되지 않아 Mock 로그인 처리됩니다.');
      return this.mockSocialLogin('google', accessToken);
    }

    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`,
      );

      if (!response.ok) {
        throw new Error(`Google API error: ${response.status}`);
      }

      const data = await response.json() as any;

      // aud 검증 — 다른 앱의 토큰으로 인증 방지
      if (data.aud !== googleClientId) {
        throw new Error('Invalid token audience');
      }

      const googleId = data.sub;
      const email = data.email;
      const nickname = data.name || `google_${googleId.slice(0, 8)}`;

      const user = await this.prisma.user.upsert({
        where: { googleId },
        update: {},
        create: { email, nickname, googleId },
      });

      return this.generateTokens(user);
    } catch (e) {
      this.logger.error(`Google login failed: ${e.message}`);
      throw new UnauthorizedException({
        code: 'AUTH_SOCIAL_FAILED',
        message: '구글 로그인에 실패했습니다.',
      });
    }
  }

  /**
   * 애플 소셜 로그인
   * APPLE_CLIENT_ID 발급 후 플레이스홀더 교체 시 구현 완성 필요
   */
  async appleLogin(accessToken: string) {
    const appleClientId = this.config.get<string>('app.social.appleClientId');

    if (!appleClientId || appleClientId.startsWith('{')) {
      this.logger.warn('APPLE_CLIENT_ID가 설정되지 않아 Mock 로그인 처리됩니다.');
      return this.mockSocialLogin('apple', accessToken);
    }

    // TODO: apple-auth 라이브러리로 ID Token 검증 구현 (키 발급 후 활성화)
    throw new BadRequestException({
      code: 'AUTH_SOCIAL_FAILED',
      message: '애플 로그인 키 설정을 완료한 후 사용 가능합니다.',
    });
  }

  /**
   * Mock 소셜 로그인 (API 키 미설정 개발 환경 전용)
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
   * Refresh Token으로 Access Token 갱신 (Token Rotation)
   */
  async refresh(refreshToken: string) {
    const userId = await this.getRefreshTokenOwner(refreshToken);
    if (!userId) {
      throw new UnauthorizedException({
        code: 'AUTH_REFRESH_EXPIRED',
        message: 'Refresh Token이 만료되었거나 유효하지 않습니다.',
      });
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException({
        code: 'AUTH_TOKEN_INVALID',
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    // 기존 RT 무효화 후 새 토큰 발급 (Rotation)
    await this.deleteRefreshToken(refreshToken);
    return this.generateTokens(user);
  }

  /**
   * 로그아웃 — 해당 사용자의 모든 Refresh Token 삭제
   */
  async logout(userId: string) {
    await this.deleteAllRefreshTokens(userId);
    return { message: '로그아웃되었습니다.' };
  }

  /**
   * JWT Access Token + Refresh Token 생성
   */
  async generateTokens(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      plan: user.plan,
      role: user.role,
    };

    const secret = this.config.get<string>('app.jwt.secret');
    const expiresIn = this.config.get<string>('app.jwt.expiresIn') || '1h';
    const refreshTtlStr = this.config.get<string>('app.jwt.refreshExpiresIn') || '30d';

    const accessToken = this.jwtService.sign(payload, { secret, expiresIn });
    const refreshToken = uuidv4();

    const refreshTtlSeconds = this.parseTtlToSeconds(refreshTtlStr);
    await this.storeRefreshToken(user.id, refreshToken, refreshTtlSeconds);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        role: user.role,
        nickname: user.nickname,
      },
    };
  }

  // ============================================================
  // Redis Refresh Token 관리
  // 키 구조: rt:{token} → userId (TTL: 30일)
  //          rt_user:{userId} → Set<token> (사용자별 토큰 추적)
  // ============================================================

  private async storeRefreshToken(userId: string, token: string, ttlSeconds: number) {
    const tokenKey = `rt:${token}`;
    const userTokensKey = `rt_user:${userId}`;

    const pipeline = this.redis.pipeline();
    pipeline.set(tokenKey, userId, 'EX', ttlSeconds);
    pipeline.sadd(userTokensKey, token);
    pipeline.expire(userTokensKey, ttlSeconds);
    await pipeline.exec();
  }

  private async getRefreshTokenOwner(token: string): Promise<string | null> {
    return this.redis.get(`rt:${token}`);
  }

  private async deleteRefreshToken(token: string) {
    const userId = await this.redis.get(`rt:${token}`);
    if (userId) {
      const pipeline = this.redis.pipeline();
      pipeline.del(`rt:${token}`);
      pipeline.srem(`rt_user:${userId}`, token);
      await pipeline.exec();
    }
  }

  private async deleteAllRefreshTokens(userId: string) {
    const userTokensKey = `rt_user:${userId}`;
    const tokens = await this.redis.smembers(userTokensKey);

    if (tokens.length > 0) {
      const pipeline = this.redis.pipeline();
      tokens.forEach((token) => pipeline.del(`rt:${token}`));
      pipeline.del(userTokensKey);
      await pipeline.exec();
    }
  }

  private parseTtlToSeconds(ttl: string): number {
    const match = ttl.match(/^(\d+)([dhms])$/);
    if (!match) return 30 * 24 * 60 * 60; // 기본 30일
    const value = parseInt(match[1], 10);
    switch (match[2]) {
      case 'd': return value * 24 * 60 * 60;
      case 'h': return value * 60 * 60;
      case 'm': return value * 60;
      case 's': return value;
      default:  return 30 * 24 * 60 * 60;
    }
  }
}
