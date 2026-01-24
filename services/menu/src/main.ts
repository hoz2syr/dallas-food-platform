import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getAppConfig } from './config/app.config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const cfg = getAppConfig();
  const app = await NestFactory.create(AppModule);
  // Swagger/OpenAPI setup
  const config = new DocumentBuilder()
    .setTitle('Menu Service API')
    .setDescription('Menu Service API documentation')
    .setVersion('v1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableShutdownHooks();
  await app.listen(cfg.port);
}

bootstrap();
