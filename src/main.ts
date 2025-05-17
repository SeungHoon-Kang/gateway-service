import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { Request, Response } from 'express';
// 필요하다면 import dotenv from 'dotenv'; 와 dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 허용
  app.enableCors();

  // 전역 prefix (선택, RESTful 버저닝)
  app.setGlobalPrefix('/api/v1');

  // 전역 유효성 검사 파이프 (DTO + class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 값 자동 제거
      forbidNonWhitelisted: true, // 정의되지 않은 값 들어오면 에러
      transform: true, // payload를 DTO 인스턴스로 변환
    }),
  );

  // 글로벌 인터셉터 (응답 래핑, 로깅 등)
  app.useGlobalInterceptors(new ResponseInterceptor<any>());

  // 헬스 체크 엔드포인트 (선택)
  app.use('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  // 포트
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
