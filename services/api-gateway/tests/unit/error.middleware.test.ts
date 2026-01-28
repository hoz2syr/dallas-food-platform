import request from 'supertest';
import express from 'express';
import { errorMiddleware } from '../../src/middleware/error.middleware';

describe('Error Middleware', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.get('/error', () => {
      throw new Error('Test error');
    });
    app.use(errorMiddleware);
  });

  it('should handle errors and return 500', async () => {
    const res = await request(app).get('/error');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Test error');
  });
});
