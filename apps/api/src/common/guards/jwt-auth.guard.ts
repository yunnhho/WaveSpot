import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * JWT 인증 Guard
 * - @Public() 데코레이터가 있으면 인증 스킵
 * - Authorization: Bearer {token} 헤더에서 JWT 추출 및 검증
 * - 검증 성공 시 request.user에 페이로드 주입
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

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
        message: '유효하지 않은 토큰 형식입니다.',
      });
    }

    // TODO: JWT 검증 로직 구현 (JwtService.verify)
    // 검증 성공 시: request.user = decoded payload
    // 만료 시: AUTH_TOKEN_EXPIRED 에러
    // 변조 시: AUTH_TOKEN_INVALID 에러

    return true;
  }
}
