import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { config } from './config';

// Load env vars
dotenv.config();

export function startServer() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.cors.origin, credentials: true }));
  app.use(compression());
  app.use(express.json());
  app.use(morgan('dev'));

  // Health check
  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  // TODO: Add routes, proxy, error handling, etc.

  const port = config.port || 8080;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API Gateway listening on port ${port}`);
  });
}
