import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
config();

async function bootstrap() {
  console.log('PORT:', process.env.PORT);
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3003);
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});
