import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('AuthService (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should signup a new user and return JWT', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({ username: 'testuser', password: 'testpass' })
      .expect(201);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body.user.username).toBe('testuser');
  });

  it('should login and return JWT', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({ username: 'loginuser', password: 'loginpass' });
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'loginuser', password: 'loginpass' })
      .expect(200);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body.user.username).toBe('loginuser');
  });

  it('should reject login with wrong password', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({ username: 'failuser', password: 'rightpass' });
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'failuser', password: 'wrongpass' })
      .expect(401);
  });

  it('should get current user with valid JWT', async () => {
    const signup = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({ username: 'meuser', password: 'mepass' });
    const token = signup.body.access_token;
    const res = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.username).toBe('meuser');
  });

  it('should reject /me with invalid JWT', async () => {
    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);
  });
});
