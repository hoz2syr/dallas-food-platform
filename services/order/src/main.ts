import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getAppConfig } from '@platform/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as promClient from 'prom-client';
import { setupWebSocket } from './websocket-server';

export async function bootstrap() {
  const cfg = getAppConfig();
  const app = await NestFactory.create(AppModule);

  // Swagger/OpenAPI setup
  const config = new DocumentBuilder()
    .setTitle('Order Service API')
    .setDescription('Order Service API documentation')
    .setVersion('v1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableShutdownHooks();

  // Prometheus metrics
  promClient.collectDefaultMetrics();
  const httpAdapter = app.getHttpAdapter();
  const server = httpAdapter.getInstance();
  if (server && typeof server.get === 'function') {
    server.get('/health', (_req, res) => res.json({ status: 'ok' }));
    server.get('/ready', (_req, res) => res.json({ ready: true }));
    server.get('/metrics', async (_req, res) => {
      res.set('Content-Type', promClient.register.contentType);
      res.send(await promClient.register.metrics());
    });
  }

  // Start HTTP server and attach WebSocket
  const server = await app.listen(cfg.PORT);
  // Attach socket.io
  const io = setupWebSocket(server);
  // Expose io for controllers/gateways
  app['io'] = io;
  return app;
}

bootstrap();