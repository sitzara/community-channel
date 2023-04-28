import { Test, TestingModule } from '@nestjs/testing';
import { RoomMessagesController } from './room-messages.controller';
import { RoomMessagesService } from './room-messages.service';
import { AuthUserRequest } from '../common/types';

describe('RoomMessagesController', () => {
  let moduleRef: TestingModule;
  let roomMessagesController: RoomMessagesController;
  let roomMessagesService: RoomMessagesService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [RoomMessagesController],
    })
      .useMocker((token) => {
        if (token === RoomMessagesService) {
          return { findAll: jest.fn(), create: jest.fn() };
        }
      })
      .compile();

    roomMessagesController = moduleRef.get<RoomMessagesController>(
      RoomMessagesController,
    );
    roomMessagesService =
      moduleRef.get<RoomMessagesService>(RoomMessagesService);
  });

  it('should be defined', () => {
    expect(roomMessagesController).toBeDefined();
    expect(roomMessagesService).toBeDefined();
  });

  describe('create', () => {
    it('should return created Message', async () => {
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

      (roomMessagesService.create as jest.Mock).mockResolvedValue(
        roomMessageEntity,
      );

      const result = await roomMessagesController.create(
        roomId,
        createRoomMessageDto,
        {
          user: { id: userId },
        } as AuthUserRequest,
      );

      expect(roomMessagesService.create).toHaveBeenCalledTimes(1);
      expect(roomMessagesService.create).toHaveBeenCalledWith(
        roomId,
        userId,
        createRoomMessageDto,
      );
      expect(result).toEqual(roomMessageEntity);
    });
  });

  describe('findAll', () => {
    it('should return latest Messages', async () => {
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

      (roomMessagesService.findAll as jest.Mock).mockResolvedValue(
        roomMessageEntities,
      );

      const result = await roomMessagesController.findAll(roomId, limit);

      expect(roomMessagesService.findAll).toHaveBeenCalledTimes(1);
      expect(roomMessagesService.findAll).toHaveBeenCalledWith(roomId, limit);
      expect(result).toEqual(roomMessageEntities);
    });
  });
});
