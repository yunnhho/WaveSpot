import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

/**
 * 관리자 검증 Guard
 * - request.user.role === 'admin' 검증
 * - 스팟 CRUD, 스팟 요청 승인/반려 등 Admin 전용 API에 적용
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException({
        code: 'AUTH_TOKEN_MISSING',
        message: '인증이 필요합니다.',
      });
    }

    if (user.role !== 'admin') {
      throw new ForbiddenException({
        code: 'AUTH_FORBIDDEN',
        message: '관리자 권한이 필요합니다.',
      });
    }

    return true;
  }
}
