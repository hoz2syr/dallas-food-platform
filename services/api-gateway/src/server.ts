import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { config } from './config/index';
import { corsMiddleware } from './middleware/cors.middleware';
import { rateLimiter } from './middleware/rateLimit.middleware';
import { correlationMiddleware, requestLogger } from './middleware/logging.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import routes from './routes';

dotenv.config();

export function startServer() {
  const app = express();

  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(correlationMiddleware as express.RequestHandler);
  app.use(requestLogger as express.RequestHandler);
  app.use(corsMiddleware);
  app.use(rateLimiter);

  // Health check
  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  // Mount all API routes (auth, proxy)
  app.use(routes);

  // Error handler
  app.use(errorMiddleware);

  const port = config.port || 8080;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API Gateway listening on port ${port}`);
  });
}
