import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS (개발환경에서는 전체 허용, 프로덕션에서는 허용 도메인 제한)
  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://admin.wavespot.kr', 'https://wavespot.kr']
      : true,
    credentials: true,
  });

  // 전역 Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // DTO에 없는 필드 자동 제거
      forbidNonWhitelisted: true,
      transform: true,          // 타입 자동 변환 (string → number 등)
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 전역 응답 래핑 Interceptor: { success, data, meta }
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 전역 예외 필터: { success, error: { code, message } }
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger API 문서 (개발 환경만)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('🌊 WAVESPOT API')
      .setDescription('한국 해양·수상 스포츠 컨디션 앱 REST API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.APP_PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 WAVESPOT API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();

