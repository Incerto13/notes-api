import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://solace.incertotech.com',
    ],
    methods: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const port = 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`)
}
bootstrap();
