import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { RoomMessagesController } from './room-messages.controller';
import { RoomMessagesService } from './room-messages.service';
import { RoomUsersService } from '../room-users/room-users.service';
import { RoomMessage } from './schemas/room-message.schema';

describe('RoomsMessagesService', () => {
  let moduleRef: TestingModule;
  let roomMessagesController: RoomMessagesController;
  let roomMessagesService: RoomMessagesService;
  let roomUsersService: RoomUsersService;
  let roomMessageModel: Model<RoomMessage>;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [RoomMessagesController],
      providers: [RoomMessagesService],
    })
      .useMocker((token) => {
        if (token === RoomUsersService) {
          return { findOne: jest.fn() };
        }

        if (token === getModelToken(RoomMessage.name)) {
          return { find: jest.fn(), create: jest.fn() };
        }
      })
      .compile();

    roomMessagesController = moduleRef.get<RoomMessagesController>(
      RoomMessagesController,
    );
    roomMessagesService =
      moduleRef.get<RoomMessagesService>(RoomMessagesService);
    roomUsersService = moduleRef.get<RoomUsersService>(RoomUsersService);
    roomMessageModel = moduleRef.get<Model<RoomMessage>>(
      getModelToken(RoomMessage.name),
    );
  });

  it('should be defined', () => {
    expect(roomMessagesController).toBeDefined();
    expect(roomMessagesService).toBeDefined();
    expect(roomUsersService).toBeDefined();
    expect(roomMessageModel).toBeDefined();
  });

  describe('find', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return Room Messages', async () => {
      const roomId = '456';
      const roomMessageEntities = [
        {
          roomId: roomId,
          userId: '321',
          userName: 'Jane Doe',
          text: 'Hello, John!',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roomId: roomId,
          userId: '123',
          userName: 'John Doe',
          text: 'Hello, chat!',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (roomMessageModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          {
            _id: '001',
            ...roomMessageEntities[0],
          },
          {
            _id: '002',
            ...roomMessageEntities[1],
          },
        ]),
      });
      const result = await roomMessagesService.findAll(roomId);

      expect(roomMessageModel.find).toHaveBeenCalledTimes(1);
      expect(roomMessageModel.find).toHaveBeenCalledWith({ roomId });
      expect(result).toEqual([
        {
          id: '001',
          ...roomMessageEntities[0],
        },
        {
          id: '002',
          ...roomMessageEntities[1],
        },
      ]);
    });

    it('should return Room Messages with limit', async () => {
      const roomId = '456';
      const limit = 2;
      const roomMessageEntities = [
        {
          roomId: roomId,
          userId: '321',
          userName: 'Jane Doe',
          text: 'Hello, John!',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roomId: roomId,
          userId: '123',
          userName: 'John Doe',
          text: 'Hello, chat!',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (roomMessageModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([
            {
              _id: '001',
              ...roomMessageEntities[0],
            },
            {
              _id: '002',
              ...roomMessageEntities[1],
            },
          ]),
        }),
      });
      const result = await roomMessagesService.findAll(roomId, limit);

      expect(roomMessageModel.find).toHaveBeenCalledTimes(1);
      expect(roomMessageModel.find).toHaveBeenCalledWith({ roomId });
      expect(result).toEqual([
        {
          id: '001',
          ...roomMessageEntities[0],
        },
        {
          id: '002',
          ...roomMessageEntities[1],
        },
      ]);
    });
  });

  describe('create', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should add create Message', async () => {
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
      const roomUserEntity = {
        userId,
        roomId,
        userName: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (roomUsersService.findOne as jest.Mock).mockResolvedValue({
        id: '789',
        ...roomUserEntity,
      });
      (roomMessageModel.create as jest.Mock).mockResolvedValue({
        _id: '987',
        ...roomMessageEntity,
      });

      const roomMessage = await roomMessagesService.create(
        roomId,
        userId,
        createRoomMessageDto,
      );
      expect(roomUsersService.findOne).toHaveBeenCalledTimes(1);
      expect(roomUsersService.findOne).toHaveBeenCalledWith(roomId, userId);
      expect(roomMessageModel.create).toHaveBeenCalledTimes(1);
      expect(roomMessageModel.create).toHaveBeenCalledWith({
        roomId,
        userId,
        userName: roomUserEntity.userName,
        text: createRoomMessageDto.text,
      });
      expect(roomMessage).toEqual({
        id: '987',
        ...roomMessageEntity,
      });
    });

    it('should throw HttpException if User is not in Room', async () => {
      const userId = '123';
      const roomId = '456';
      const createRoomMessageDto = { text: 'Hello, chat!' };
      const exception = new HttpException(
        'Not acceptable',
        HttpStatus.NOT_ACCEPTABLE,
      );

      (roomUsersService.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        roomMessagesService.create(roomId, userId, createRoomMessageDto),
      ).rejects.toThrow(exception);
      expect(roomUsersService.findOne).toHaveBeenCalledTimes(1);
      expect(roomUsersService.findOne).toHaveBeenCalledWith(roomId, userId);
      expect(roomMessageModel.create).not.toHaveBeenCalled();
    });
  });
});
