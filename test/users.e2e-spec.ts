import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';
import { User } from '../src/users/schemas/user.schema';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue({ create: jest.fn() })
      .overrideProvider(getModelToken(User.name))
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST)', async () => {
    const result = {
      id: '123',
      name: 'John Doe',
      createdAt: '2023-04-27T20:12:39.742Z',
      updatedAt: '2023-04-27T20:12:39.742Z',
    };

    (moduleRef.get(UsersService).create as jest.Mock).mockResolvedValue(result);

    const response = await request(app.getHttpServer()).post('/users');
    expect(response.status).toBe(201);
    expect(response.body).toEqual(result);
  });
});
