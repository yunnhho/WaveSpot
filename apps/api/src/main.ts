import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // ============================================================
  // 보안 헤더 (Helmet) — TDD 10. 보안 체크리스트
  // XSS, Clickjacking, MIME-sniffing, HSTS 등 방어
  // ============================================================
  app.use(
    helmet({
      // HSTS: HTTPS 강제 (1년)
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      // X-Frame-Options: Clickjacking 방지
      frameguard: { action: 'deny' },
      // X-Content-Type-Options: MIME-sniffing 방지
      noSniff: true,
      // Referrer-Policy
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      // Content-Security-Policy (API 서버이므로 최소화)
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      // X-DNS-Prefetch-Control
      dnsPrefetchControl: { allow: false },
      // X-Permitted-Cross-Domain-Policies
      permittedCrossDomainPolicies: false,
      // Swagger UI를 위해 crossOriginEmbedderPolicy는 개발에서 완화
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production',
    }),
  );

  // ============================================================
  // CORS — 개발: 전체 허용 / 프로덕션: 허용 도메인 제한
  // ============================================================
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://admin.wavespot.kr', 'https://wavespot.kr']
        : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ============================================================
  // 전역 Validation Pipe
  // ============================================================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 전역 응답 래핑 Interceptor: { success, data, meta }
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 전역 예외 필터: { success, error: { code, message } }
  app.useGlobalFilters(new HttpExceptionFilter());

  // ============================================================
  // Swagger API 문서 (개발 환경만)
  // ============================================================
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('🌊 WAVESPOT API')
      .setDescription('한국 해양·수상 스포츠 컨디션 앱 REST API — SRS v1.4 / TDD v1.1')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  const port = parseInt(process.env.APP_PORT || '3000', 10);
  await app.listen(port);
  console.log(`🚀 WAVESPOT API running on http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  }
}
bootstrap();
