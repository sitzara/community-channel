import { Test, TestingModule } from '@nestjs/testing';
import { RoomUsersController } from './room-users.controller';
import { RoomUsersService } from './room-users.service';

describe('RoomUsersController', () => {
  let moduleRef: TestingModule;
  let roomUsersController: RoomUsersController;
  let roomUsersService: RoomUsersService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [RoomUsersController],
    })
      .useMocker((token) => {
        if (token === RoomUsersService) {
          return { create: jest.fn() };
        }
      })
      .compile();

    roomUsersController =
      moduleRef.get<RoomUsersController>(RoomUsersController);
    roomUsersService = moduleRef.get<RoomUsersService>(RoomUsersService);
  });

  it('should be defined', () => {
    expect(roomUsersController).toBeDefined();
    expect(roomUsersService).toBeDefined();
  });

  describe('create', () => {
    it('should add User to the Room', async () => {
      const roomId = '456';
      const createRoomUserDto = { userId: '123' };
      const roomUserEntity = {
        userId: createRoomUserDto.userId,
        roomId: '456',
        userName: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (roomUsersService.create as jest.Mock).mockResolvedValue(roomUserEntity);

      const result = await roomUsersController.create(
        roomId,
        createRoomUserDto,
      );

      expect(roomUsersService.create).toHaveBeenCalledTimes(1);
      expect(roomUsersService.create).toHaveBeenCalledWith(
        roomId,
        createRoomUserDto,
      );
      expect(result).toBeUndefined();
    });
  });
});
