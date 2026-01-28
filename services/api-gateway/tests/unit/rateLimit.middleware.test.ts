import request from 'supertest';
import express from 'express';

// Mock express-rate-limit and rate-limit-redis to use MemoryStore for tests
jest.mock('rate-limit-redis', () => {
  return jest.fn().mockImplementation(() => {
    const MemoryStore = require('express-rate-limit').MemoryStore;
    return new MemoryStore();
  });
});

// Re-import after mocking
const { rateLimiter } = require('../../src/middleware/rateLimit.middleware');

describe('Rate Limiting Middleware', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(rateLimiter);
    app.get('/test', (req, res) => res.json({ ok: true }));
  });

  it('should allow requests under the limit', async () => {
    for (let i = 0; i < 3; i++) {
      const res = await request(app).get('/test');
      expect(res.status).toBe(200);
    }
  });

  // Note: For a real Redis-backed test, use a test Redis instance or mock Redis
});
  jest.setTimeout(20000);
