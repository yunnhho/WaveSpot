import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * WAVESPOT 표준 응답 래핑 Interceptor
 *
 * 모든 성공 응답을 아래 형식으로 래핑합니다:
 * {
 *   "success": true,
 *   "data": { ... },
 *   "meta": { "timestamp": "..." }
 * }
 *
 * 페이지네이션 응답 (data가 배열 + pagination 포함 시):
 * {
 *   "success": true,
 *   "data": [...],
 *   "pagination": { "page": 1, "limit": 20, "total": 150 }
 * }
 */
export interface WavespotResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, any>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, WavespotResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<WavespotResponse<T>> {
    return next.handle().pipe(
      map((responseData) => {
        // 이미 래핑된 응답은 그대로 반환
        if (responseData && responseData.success !== undefined) {
          return responseData;
        }

        // 페이지네이션 응답 처리
        if (responseData && responseData.pagination) {
          return {
            success: true,
            data: responseData.data,
            pagination: responseData.pagination,
          };
        }

        // 일반 응답 래핑
        return {
          success: true,
          data: responseData,
          meta: {
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}
