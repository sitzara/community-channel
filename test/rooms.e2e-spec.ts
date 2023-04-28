import * as request from 'supertest';
import { INestApplication, HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';
import { User } from '../src/users/schemas/user.schema';
import { RoomsModule } from '../src/rooms/rooms.module';
import { RoomsService } from '../src/rooms/rooms.service';
import { Room } from '../src/rooms/schemas/room.schema';

describe('RoomsController (e2e)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let roomsService: RoomsService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UsersModule, RoomsModule],
    })
      .overrideProvider(UsersService)
      .useValue({ findById: jest.fn() })
      .overrideProvider(getModelToken(User.name))
      .useValue({})
      .overrideProvider(RoomsService)
      .useValue({ create: jest.fn() })
      .overrideProvider(getModelToken(Room.name))
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    roomsService = moduleRef.get<RoomsService>(RoomsService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/rooms (POST)', () => {
    it('should return CREATED status and created Room', async () => {
      const result = {
        id: '456',
        name: 'Room # 1',
        createdAt: '2023-04-27T20:12:39.742Z',
        updatedAt: '2023-04-27T20:12:39.742Z',
      };

      (roomsService.create as jest.Mock).mockResolvedValue(result);

      const response = await request(app.getHttpServer())
        .post('/rooms')
        .set('user-id', '123');
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(result);
    });

    it('should return UNAUTHORIZED in user-id header was not provided', async () => {
      const response = await request(app.getHttpServer()).post('/rooms');
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    });

    it('should return HttpStatus in case of HttpException', async () => {
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

      (roomsService.create as jest.Mock).mockImplementation(() => {
        throw exception;
      });

      const response = await request(app.getHttpServer())
        .post('/rooms')
        .set('user-id', '123');
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not found',
      });
    });

    it('should return INTERNAL_SERVER_ERROR in case of unexpected error', async () => {
      const exception = new Error('MongoDB error');

      (roomsService.create as jest.Mock).mockImplementation(() => {
        throw exception;
      });

      const response = await request(app.getHttpServer())
        .post('/rooms')
        .set('user-id', '123');
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    });
  });
});
