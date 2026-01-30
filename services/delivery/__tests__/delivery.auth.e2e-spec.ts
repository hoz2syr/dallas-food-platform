import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AppModule as AuthAppModule } from '../../auth/src/app.module';

describe('Delivery Auth (e2e)', () => {
  let app: INestApplication;
  let jwt: string;

  beforeAll(async () => {
    // Mock Auth: create a user and get JWT from Auth Service
    const authApp = await Test.createTestingModule({
      imports: [AuthAppModule],
    }).compile();
    const auth = authApp.createNestApplication();
    await auth.init();
    const res = await request(auth.getHttpServer())
      .post('/api/auth/signup')
      .send({ username: 'deliveryuser', password: 'deliverypass' });
    jwt = res.body.access_token;
    await auth.close();

    // Start Delivery app
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should reject protected endpoint without JWT', async () => {
    await request(app.getHttpServer())
      .get('/delivery/anyid')
      .expect(401);
  });

  it('should allow access with valid JWT', async () => {
    await request(app.getHttpServer())
      .get('/delivery/anyid')
      .set('Authorization', `Bearer ${jwt}`)
      .expect((res: request.Response) => {
        // 404 is expected because delivery not found, but not 401
        if (res.status === 401) throw new Error('Should not be 401');
      });
  });
});
