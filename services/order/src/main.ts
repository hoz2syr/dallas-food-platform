import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getAppConfig } from './config/app.config';

async function bootstrap() {
  const cfg = getAppConfig();
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(cfg.port);
}

bootstrap();
