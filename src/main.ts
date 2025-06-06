import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
config();

async function bootstrap() {
  console.log('PORT:', process.env.PORT);

  const app = await NestFactory.create(AppModule);
  // Глобальный пайп валидации для всего приложения:
  // ValidationPipe автоматически валидирует входящие данные по DTO-классам,
  // а опция whitelist: true — удаляет из запроса все свойства, которые не описаны в DTO.
  // Это помогает защитить приложение от лишних или нежелательных данных.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3003);
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});
