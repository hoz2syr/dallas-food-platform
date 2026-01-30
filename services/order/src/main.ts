
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getAppConfig } from '../../../packages/config/src/getAppConfig';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as promClient from 'prom-client';
import { setupWebSocket } from './websocket-server';

// تعريف الدالة وصدّرها مباشرة
export const bootstrap = async () => {
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
  let server = httpAdapter.getInstance();
  
  if (server && typeof server.get === 'function') {
    server.get('/health', (_req: any, res: any) => res.json({ status: 'ok' }));
    server.get('/ready', (_req: any, res: any) => res.json({ ready: true }));
    server.get('/metrics', async (_req: any, res: any) => {
      res.set('Content-Type', promClient.register.contentType);
      res.send(await promClient.register.metrics());
    });
  }

  server = await app.listen(cfg.PORT);
  // Attach socket.io instance
  const io = setupWebSocket(server);
  // If you need to access io elsewhere, store it in an external variable or a dedicated service instead of assigning it directly to app
  // Example: export { io } or use a Singleton pattern

  console.log(`🚀 Order service running on port ${cfg.PORT}`);
  return app;
};

export default bootstrap;

// Auto-invoke only if this file is run directly
if (require.main === module) {
  bootstrap().catch(error => {
    console.error('Failed to bootstrap:', error);
    process.exit(1);
  });
}

