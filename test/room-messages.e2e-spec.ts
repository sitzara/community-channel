import * as request from 'supertest';
import { INestApplication, HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';
import { User } from '../src/users/schemas/user.schema';
import { RoomsService } from '../src/rooms/rooms.service';
import { Room } from '../src/rooms/schemas/room.schema';
import { RoomUsersModule } from '../src/room-users/room-users.module';
import { RoomUsersService } from '../src/room-users/room-users.service';
import { RoomUser } from '../src/room-users/schemas/room-user.schema';
import { RoomMessagesModule } from '../src/room-messages/room-messages.module';
import { RoomMessagesService } from '../src/room-messages/room-messages.service';
import { RoomMessage } from '../src/room-messages/schemas/room-message.schema';

describe('RoomMessagesController (e2e)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let roomMessagesService: RoomMessagesService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UsersModule, RoomUsersModule, RoomMessagesModule],
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
      .overrideProvider(RoomMessagesService)
      .useValue({ findAll: jest.fn(), create: jest.fn() })
      .overrideProvider(getModelToken(RoomMessage.name))
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    roomMessagesService =
      moduleRef.get<RoomMessagesService>(RoomMessagesService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/rooms/:id/messages (GET)', () => {
    it('should return OK status and found Messages', async () => {
      const userId = '123';
      const roomId = '456';
      const limit = 2;
      const createdAt = new Date();
      const updatedAt = new Date();
      const roomMessageEntities = [
        {
          id: '001',
          roomId: roomId,
          userId: '321',
          userName: 'Jane Doe',
          text: 'Hello, John!',
          createdAt,
          updatedAt,
        },
        {
          id: '002',
          roomId: roomId,
          userId: '123',
          userName: 'John Doe',
          text: 'Hello, chat!',
          createdAt,
          updatedAt,
        },
      ];

      (roomMessagesService.findAll as jest.Mock).mockResolvedValue(
        roomMessageEntities,
      );

      const response = await request(app.getHttpServer())
        .get(`/rooms/${roomId}/messages?limit=${limit}`)
        .set('user-id', userId);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual([
        {
          ...roomMessageEntities[0],
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
        },
        {
          ...roomMessageEntities[1],
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
        },
      ]);
    });
  });

  describe('/rooms/:id/messages (POST)', () => {
    it('should return CREATED status', async () => {
      const userId = '123';
      const roomId = '456';
      const createRoomMessageDto = { text: 'Hello, chat!' };
      const roomMessageEntity = {
        roomId: roomId,
        userId: userId,
        userName: 'John Doe',
        text: createRoomMessageDto.text,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (roomMessagesService.create as jest.Mock).mockResolvedValue({
        id: '789',
        ...roomMessageEntity,
      });

      const response = await request(app.getHttpServer())
        .post(`/rooms/${roomId}/messages`)
        .send(createRoomMessageDto)
        .set('user-id', '123');
      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it('should return UNAUTHORIZED in user-id header was not provided', async () => {
      const roomId = '456';
      const createRoomMessageDto = { text: 'Hello, chat!' };

      const response = await request(app.getHttpServer())
        .post(`/rooms/${roomId}/messages`)
        .send(createRoomMessageDto);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toEqual({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    });

    it('should return HttpStatus in case of HttpException', async () => {
      const userId = '123';
      const roomId = '456';
      const createRoomMessageDto = { text: 'Hello, chat!' };
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

      (roomMessagesService.create as jest.Mock).mockImplementation(() => {
        throw exception;
      });

      const response = await request(app.getHttpServer())
        .post(`/rooms/${roomId}/messages`)
        .send(createRoomMessageDto)
        .set('user-id', userId);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not found',
      });
    });

    it('should return INTERNAL_SERVER_ERROR in case of unexpected error', async () => {
      const userId = '123';
      const roomId = '456';
      const createRoomMessageDto = { text: 'Hello, chat!' };
      const exception = new Error('MongoDB error');

      (roomMessagesService.create as jest.Mock).mockImplementation(() => {
        throw exception;
      });

      const response = await request(app.getHttpServer())
        .post(`/rooms/${roomId}/messages`)
        .send(createRoomMessageDto)
        .set('user-id', userId);
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    });
  });
});
