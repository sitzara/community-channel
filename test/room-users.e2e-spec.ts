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
import { RoomUsersModule } from '../src/room-users/room-users.module';
import { RoomUsersService } from '../src/room-users/room-users.service';
import { RoomUser } from '../src/room-users/schemas/room-user.schema';

describe('RoomUsersController (e2e)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let roomUsersService: RoomUsersService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UsersModule, RoomsModule, RoomUsersModule],
    })
      .overrideProvider(UsersService)
      .useValue({ findById: jest.fn() })
      .overrideProvider(getModelToken(User.name))
      .useValue({})
      .overrideProvider(RoomsService)
      .useValue({ create: jest.fn() })
      .overrideProvider(getModelToken(Room.name))
      .useValue({})
      .overrideProvider(RoomUsersService)
      .useValue({ create: jest.fn() })
      .overrideProvider(getModelToken(RoomUser.name))
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    roomUsersService = moduleRef.get<RoomUsersService>(RoomUsersService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/rooms/:id/users (POST)', () => {
    it('should return CREATED status', async () => {
      const roomId = '456';
      const createRoomDto = { userId: '321' };
      const roomUserEntity = {
        userId: createRoomDto.userId,
        roomId,
        userName: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (roomUsersService.create as jest.Mock).mockResolvedValue({
        id: '789',
        ...roomUserEntity,
      });

      const response = await request(app.getHttpServer())
        .post(`/rooms/${roomId}/users`)
        .send(createRoomDto)
        .set('user-id', '123');
      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it('should return UNAUTHORIZED in user-id header was not provided', async () => {
      const roomId = '456';
      const createRoomDto = { userId: '321' };

      const response = await request(app.getHttpServer())
        .post(`/rooms/${roomId}/users`)
        .send(createRoomDto);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    });

    it('should return HttpStatus in case of HttpException', async () => {
      const roomId = '456';
      const createRoomDto = { userId: '321' };
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

      (roomUsersService.create as jest.Mock).mockImplementation(() => {
        throw exception;
      });

      const response = await request(app.getHttpServer())
        .post(`/rooms/${roomId}/users`)
        .send(createRoomDto)
        .set('user-id', '123');
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not found',
      });
    });

    it('should return INTERNAL_SERVER_ERROR in case of unexpected error', async () => {
      const roomId = '456';
      const createRoomDto = { userId: '321' };
      const exception = new Error('MongoDB error');

      (roomUsersService.create as jest.Mock).mockImplementation(() => {
        throw exception;
      });

      const response = await request(app.getHttpServer())
        .post(`/rooms/${roomId}/users`)
        .send(createRoomDto)
        .set('user-id', '123');
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    });
  });
});
