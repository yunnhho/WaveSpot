import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

/**
 * Pro 구독자 검증 Guard
 * - request.user.plan === 'pro' 검증
 * - Free 사용자가 Pro 전용 기능 접근 시 403 반환
 * - 사용: Expert View, 관측소 데이터, 알림 빌더, 커뮤니티 작성 등
 */
@Injectable()
export class ProGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException({
        code: 'AUTH_TOKEN_MISSING',
        message: '인증이 필요합니다.',
      });
    }

    if (user.plan !== 'pro') {
      throw new ForbiddenException({
        code: 'PLAN_REQUIRED',
        message: 'Pro 구독이 필요한 기능입니다.',
      });
    }

    return true;
  }
}
