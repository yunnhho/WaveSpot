import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * WAVESPOT 전역 HTTP 예외 필터
 *
 * 모든 에러 응답을 아래 형식으로 통일합니다:
 * {
 *   "success": false,
 *   "error": {
 *     "code": "SPOT_NOT_FOUND",
 *     "message": "스팟을 찾을 수 없습니다."
 *   }
 * }
 *
 * 에러 코드 체계:
 * - AUTH_*: 인증 관련 (401, 403)
 * - PLAN_*: 구독 플랜 관련 (403)
 * - SPOT_*: 스팟 관련 (400, 404, 409, 429)
 * - WEATHER_*: 기상 데이터 관련 (404, 503)
 * - RATE_*: Rate Limit (429)
 * - VALIDATION_ERROR: 요청 검증 실패 (400)
 * - SERVER_*: 서버 내부 (500, 503)
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'SERVER_INTERNAL';
    let message = '일시적인 오류입니다. 잠시 후 다시 시도해주세요.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as Record<string, any>;

        // 커스텀 에러 코드가 있는 경우
        if (res.code) {
          code = res.code;
          message = res.message || message;
        }
        // class-validator 검증 에러
        else if (res.message && Array.isArray(res.message)) {
          code = 'VALIDATION_ERROR';
          message = res.message.join(', ');
        }
        // 일반 HttpException
        else {
          code = this.getErrorCode(status);
          message = res.message || exception.message || message;
        }
      } else {
        code = this.getErrorCode(status);
        message = String(exceptionResponse);
      }
    } else {
      // 예상치 못한 에러 — 로깅 후 500 반환
      this.logger.error(
        `Unexpected error: ${exception}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
      },
    });
  }

  /**
   * HTTP 상태 코드 → WAVESPOT 에러 코드 매핑
   */
  private getErrorCode(status: number): string {
    switch (status) {
      case 400:
        return 'VALIDATION_ERROR';
      case 401:
        return 'AUTH_TOKEN_INVALID';
      case 403:
        return 'AUTH_FORBIDDEN';
      case 404:
        return 'SPOT_NOT_FOUND';
      case 409:
        return 'SPOT_DUPLICATE';
      case 429:
        return 'RATE_LIMIT_EXCEEDED';
      case 503:
        return 'SERVER_MAINTENANCE';
      default:
        return 'SERVER_INTERNAL';
    }
  }
}
