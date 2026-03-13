import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * JWT 인증 Guard
 * - @Public() 데코레이터가 있으면 인증 스킵
 * - Authorization: Bearer {token} 헤더에서 JWT 추출 및 검증
 * - 검증 성공 시 request.user에 페이로드 주입
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // @Public() 데코레이터 체크
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException({
        code: 'AUTH_TOKEN_MISSING',
        message: 'Authorization 헤더가 없습니다.',
      });
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException({
        code: 'AUTH_TOKEN_INVALID',
        message: '유효하지 않은 토큰 형식입니다. Bearer {token} 형식으로 전송하세요.',
      });
    }

    try {
      const secret = this.config.get<string>('app.jwt.secret');
      const payload = this.jwtService.verify(token, { secret });
      request.user = payload;
      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          code: 'AUTH_TOKEN_EXPIRED',
          message: 'Access Token이 만료되었습니다. Refresh Token으로 갱신하세요.',
        });
      }
      throw new UnauthorizedException({
        code: 'AUTH_TOKEN_INVALID',
        message: '유효하지 않거나 변조된 토큰입니다.',
      });
    }
  }
}
