import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { RoomUsersController } from './room-users.controller';
import { RoomUsersService } from './room-users.service';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { RoomUser } from './schemas/room-user.schema';

describe('RoomUsersService', () => {
  let moduleRef: TestingModule;
  let roomUsersController: RoomUsersController;
  let roomUsersService: RoomUsersService;
  let roomsService: RoomsService;
  let usersService: UsersService;
  let roomUserModel: Model<RoomUser>;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [RoomUsersController],
      providers: [RoomUsersService],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return { findById: jest.fn() };
        }

        if (token === RoomsService) {
          return { findById: jest.fn() };
        }

        if (token === getModelToken(RoomUser.name)) {
          return { findOne: jest.fn(), create: jest.fn() };
        }
      })
      .compile();

    roomUsersController =
      moduleRef.get<RoomUsersController>(RoomUsersController);
    roomUsersService = moduleRef.get<RoomUsersService>(RoomUsersService);
    roomsService = moduleRef.get<RoomsService>(RoomsService);
    usersService = moduleRef.get<UsersService>(UsersService);
    roomUserModel = moduleRef.get<Model<RoomUser>>(
      getModelToken(RoomUser.name),
    );
  });

  it('should be defined', () => {
    expect(roomUsersController).toBeDefined();
    expect(roomUsersService).toBeDefined();
    expect(roomsService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('findOne', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return Room User', async () => {
      const userId = '123';
      const roomId = '456';
      const roomUserEntity = {
        userId,
        roomId,
        userName: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (roomUserModel.findOne as jest.Mock).mockResolvedValue({
        _id: '789',
        ...roomUserEntity,
      });
      const roomUser = await roomUsersService.findOne(roomId, userId);

      expect(roomUserModel.findOne).toHaveBeenCalledTimes(1);
      expect(roomUserModel.findOne).toHaveBeenCalledWith({ roomId, userId });
      expect(roomUser).toEqual({
        id: '789',
        ...roomUserEntity,
      });
    });
  });

  describe('create', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should add User to the Room', async () => {
      const roomId = '456';
      const createRoomDto = { userId: '321' };

      const userEntity = {
        name: 'Jane Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const roomEntity = {
        name: 'Room #1',
        creatorId: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const roomUserEntity = {
        userId: createRoomDto.userId,
        roomId,
        userName: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (roomsService.findById as jest.Mock).mockResolvedValue({
        id: '456',
        ...roomEntity,
      });
      (usersService.findById as jest.Mock).mockResolvedValue({
        id: '321',
        ...userEntity,
      });
      const roomUsersServiceFindOneSpy = jest
        .spyOn(roomUsersService, 'findOne')
        .mockResolvedValue(null);
      (roomUserModel.create as jest.Mock).mockResolvedValue({
        _id: '789',
        ...roomUserEntity,
      });

      const roomUser = await roomUsersService.create(roomId, createRoomDto);
      expect(roomsService.findById).toHaveBeenCalledTimes(1);
      expect(roomsService.findById).toHaveBeenCalledWith(roomId);
      expect(usersService.findById).toHaveBeenCalledTimes(1);
      expect(usersService.findById).toHaveBeenCalledWith(createRoomDto.userId);
      expect(roomUsersServiceFindOneSpy).toHaveBeenCalledTimes(1);
      expect(roomUsersServiceFindOneSpy).toHaveBeenCalledWith(
        roomId,
        createRoomDto.userId,
      );
      expect(roomUserModel.create).toHaveBeenCalledTimes(1);
      expect(roomUserModel.create).toHaveBeenCalledWith({
        roomId,
        userId: createRoomDto.userId,
        userName: userEntity.name,
      });
      expect(roomUser).toEqual({
        id: '789',
        ...roomUserEntity,
      });
    });

    it('should throw HttpException if Room is not found', async () => {
      const roomId = '456';
      const createRoomDto = { userId: '321' };
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

      (roomsService.findById as jest.Mock).mockImplementation(() => {
        throw exception;
      });
      const roomUsersServiceFindOneSpy = jest.spyOn(
        roomUsersService,
        'findOne',
      );

      await expect(
        roomUsersService.create(roomId, createRoomDto),
      ).rejects.toThrow(exception);
      expect(roomsService.findById).toHaveBeenCalledTimes(1);
      expect(roomsService.findById).toHaveBeenCalledWith(roomId);
      expect(usersService.findById).not.toHaveBeenCalled();
      expect(roomUserModel.create).not.toHaveBeenCalled();
      expect(roomUsersServiceFindOneSpy).not.toHaveBeenCalled();
    });

    it('should throw HttpException if User is not found', async () => {
      const roomId = '456';
      const createRoomDto = { userId: '321' };
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);
      const roomEntity = {
        name: 'Room #1',
        creatorId: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (roomsService.findById as jest.Mock).mockResolvedValue({
        id: '456',
        ...roomEntity,
      });
      (usersService.findById as jest.Mock).mockImplementation(() => {
        throw exception;
      });
      const roomUsersServiceFindOneSpy = jest.spyOn(
        roomUsersService,
        'findOne',
      );

      await expect(
        roomUsersService.create(roomId, createRoomDto),
      ).rejects.toThrow(exception);
      expect(roomsService.findById).toHaveBeenCalledTimes(1);
      expect(roomsService.findById).toHaveBeenCalledWith(roomId);
      expect(usersService.findById).toHaveBeenCalledTimes(1);
      expect(usersService.findById).toHaveBeenCalledWith(createRoomDto.userId);
      expect(roomUserModel.create).not.toHaveBeenCalled();
      expect(roomUsersServiceFindOneSpy).not.toHaveBeenCalled();
    });

    it('should throw HttpException if User is already added to Room', async () => {
      const roomId = '456';
      const createRoomDto = { userId: '321' };
      const exception = new HttpException('Already added', HttpStatus.CONFLICT);
      const userEntity = {
        name: 'Jane Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const roomEntity = {
        name: 'Room #1',
        creatorId: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const roomUserEntity = {
        userId: createRoomDto.userId,
        roomId,
        userName: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (roomsService.findById as jest.Mock).mockResolvedValue({
        id: '456',
        ...roomEntity,
      });
      (usersService.findById as jest.Mock).mockResolvedValue({
        id: '321',
        ...userEntity,
      });
      const roomUsersServiceFindOneSpy = jest
        .spyOn(roomUsersService, 'findOne')
        .mockResolvedValue({
          id: '789',
          ...roomUserEntity,
        });

      await expect(
        roomUsersService.create(roomId, createRoomDto),
      ).rejects.toThrow(exception);
      expect(roomsService.findById).toHaveBeenCalledTimes(1);
      expect(roomsService.findById).toHaveBeenCalledWith(roomId);
      expect(usersService.findById).toHaveBeenCalledTimes(1);
      expect(usersService.findById).toHaveBeenCalledWith(createRoomDto.userId);
      expect(roomUsersServiceFindOneSpy).toHaveBeenCalledTimes(1);
      expect(roomUsersServiceFindOneSpy).toHaveBeenCalledWith(
        roomId,
        createRoomDto.userId,
      );
      expect(roomUserModel.create).not.toHaveBeenCalled();
    });
  });
});
