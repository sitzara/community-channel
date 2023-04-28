import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { AuthUserRequest } from '../common/types';

describe('RoomsController', () => {
  let moduleRef: TestingModule;
  let roomsController: RoomsController;
  let roomsService: RoomsService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [RoomsController],
    })
      .useMocker((token) => {
        if (token === RoomsService) {
          return { findById: jest.fn(), create: jest.fn() };
        }
      })
      .compile();

    roomsController = moduleRef.get<RoomsController>(RoomsController);
    roomsService = moduleRef.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(roomsController).toBeDefined();
    expect(roomsService).toBeDefined();
  });

  describe('create', () => {
    it('should return created Room', async () => {
      const userId = '123';
      const createUserDto = { name: 'Room #1' };
      const roomEntity = {
        id: '456',
        name: createUserDto.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (roomsService.create as jest.Mock).mockResolvedValue(roomEntity);

      const user = await roomsController.create(createUserDto, {
        user: { id: userId },
      } as AuthUserRequest);
      expect(roomsService.create).toHaveBeenCalledTimes(1);
      expect(roomsService.create).toHaveBeenCalledWith(userId, createUserDto);
      expect(user).toEqual(roomEntity);
    });
  });

  describe('findOne', () => {
    it('should return found Room', async () => {
      const roomId = '456';
      const roomEntity = {
        id: roomId,
        name: 'Room #1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (roomsService.findById as jest.Mock).mockResolvedValue(roomEntity);

      const room = await roomsController.findOne(roomId);
      expect(roomsService.findById).toHaveBeenCalledTimes(1);
      expect(roomsService.findById).toHaveBeenCalledWith(roomId);
      expect(room).toEqual(roomEntity);
    });
  });
});
