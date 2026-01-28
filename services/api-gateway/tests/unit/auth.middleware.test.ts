process.env.JWT_SECRET = 'test';
import request from 'supertest';
import express from 'express';
import { authMiddleware } from '../../src/middleware/auth.middleware';
import jwt from 'jsonwebtoken';
import { config } from '../../src/config';

describe('Auth Middleware', () => {
  let app: express.Express;
  const user = { sub: 'user-1', permissions: ['order:create'] };
  const token = jwt.sign(user, config.jwt.secret || 'test', { expiresIn: '1h' });

  beforeAll(() => {
    app = express();
    app.get('/protected', authMiddleware(['order:create']), (req, res) => res.json({ ok: true }));
  });

  it('should allow valid token with permission', async () => {
    const res = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('should reject missing token', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
  });
});
