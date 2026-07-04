import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Vejas backend (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/health (GET) returns ok', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => expect(res.body).toMatchObject({ status: 'ok' }));
  });

  it('/rooms (GET) is public and returns an array', () => {
    return request(app.getHttpServer())
      .get('/rooms')
      .expect(200)
      .expect((res) => expect(res.body).toEqual([]));
  });

  it('/rooms (POST) without token returns 401', () => {
    return request(app.getHttpServer())
      .post('/rooms')
      .send({ name: 'My room' })
      .expect(401);
  });

  it('/rooms/:id (GET) for unknown room returns 404', () => {
    return request(app.getHttpServer()).get('/rooms/nope').expect(404);
  });
});
