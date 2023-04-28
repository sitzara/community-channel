import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';
import { User } from '../src/users/schemas/user.schema';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let usersService: UsersService;

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

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should return CREATED status and created User', async () => {
      const createUserDto = { name: 'John Doe' };
      const result = {
        id: '123',
        name: createUserDto.name,
        createdAt: '2023-04-27T20:12:39.742Z',
        updatedAt: '2023-04-27T20:12:39.742Z',
      };

      (usersService.create as jest.Mock).mockResolvedValue(result);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(result);
    });

    it('should return INTERNAL_SERVER_ERROR in case of unexpected error', async () => {
      const createUserDto = { name: 'John Doe' };
      const exception = new Error('MongoDB error');

      (usersService.create as jest.Mock).mockImplementation(() => {
        throw exception;
      });

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto);
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    });
  });
});
