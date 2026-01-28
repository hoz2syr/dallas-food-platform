import client, { Counter, collectDefaultMetrics, Registry } from 'prom-client';
import express from 'express';

const register = new Registry();
collectDefaultMetrics({ register });

export const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

export function metricsMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode,
    });
  });
  next();
}

export function metricsEndpoint(req: express.Request, res: express.Response) {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
}
