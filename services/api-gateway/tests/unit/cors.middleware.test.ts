import request from 'supertest';
import express from 'express';
import { corsMiddleware } from '../../src/middleware/cors.middleware';

describe('CORS Middleware', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(corsMiddleware);
    app.get('/test', (req, res) => res.json({ ok: true }));
  });

  it('should set CORS headers', async () => {
    const res = await request(app).get('/test');
    expect(res.headers['access-control-allow-origin']).toBeDefined();
    expect(res.status).toBe(200);
  });
});
