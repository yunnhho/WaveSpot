import { SetMetadata } from '@nestjs/common';

/**
 * Public 데코레이터
 * 이 데코레이터가 적용된 엔드포인트는 JWT 인증 없이 접근 가능
 * 사용법: @Public()
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
