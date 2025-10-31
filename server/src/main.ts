import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
