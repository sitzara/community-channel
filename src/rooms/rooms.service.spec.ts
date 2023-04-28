import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { UsersService } from '../users/users.service';
import { Room } from './schemas/room.schema';

describe('RoomsService', () => {
  let moduleRef: TestingModule;
  let roomsController: RoomsController;
  let roomsService: RoomsService;
  let usersService: UsersService;
  let roomModel: Model<Room>;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [RoomsService],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return { findById: jest.fn() };
        }

        if (token === getModelToken(Room.name)) {
          return { findById: jest.fn(), create: jest.fn() };
        }
      })
      .compile();

    roomsController = moduleRef.get<RoomsController>(RoomsController);
    roomsService = moduleRef.get<RoomsService>(RoomsService);
    usersService = moduleRef.get<UsersService>(UsersService);
    roomModel = moduleRef.get<Model<Room>>(getModelToken(Room.name));
  });

  it('should be defined', () => {
    expect(roomsController).toBeDefined();
    expect(roomsService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(roomModel).toBeDefined();
  });

  describe('findById', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return Room', async () => {
      const id = '456';
      const roomEntity = {
        name: 'Room # 1',
        creatorId: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (roomModel.findById as jest.Mock).mockResolvedValue({
        _id: '456',
        ...roomEntity,
      });
      const user = await roomsService.findById(id);

      expect(roomModel.findById).toHaveBeenCalledTimes(1);
      expect(roomModel.findById).toHaveBeenCalledWith(id);
      expect(user).toEqual({
        id: '456',
        ...roomEntity,
      });
    });

    it('should throw HttpException if Room is not found', async () => {
      const id = '456';
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

      (roomModel.findById as jest.Mock).mockImplementation(() => {
        throw exception;
      });

      await expect(roomsService.findById(id)).rejects.toThrow(exception);

      expect(roomModel.findById).toHaveBeenCalledTimes(1);
      expect(roomModel.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return created Room with creatorId = userId', async () => {
      const userId = '123';
      const createRoomDto = { name: 'Room #1' };

      const userEntity = {
        name: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const roomEntity = {
        name: createRoomDto.name,
        creatorId: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (usersService.findById as jest.Mock).mockResolvedValue({
        id: '123',
        ...userEntity,
      });
      (roomModel.create as jest.Mock).mockResolvedValue({
        _id: '456',
        ...roomEntity,
      });

      const user = await roomsService.create(userId, createRoomDto);
      expect(usersService.findById).toHaveBeenCalledTimes(1);
      expect(usersService.findById).toHaveBeenCalledWith(userId);

      expect(roomModel.create).toHaveBeenCalledTimes(1);
      expect(roomModel.create).toHaveBeenCalledWith({
        name: createRoomDto.name,
        creatorId: userId,
      });
      expect(user).toEqual({
        id: '456',
        ...roomEntity,
      });
    });

    it('should throw HttpException if user is not found', async () => {
      const userId = '123';
      const createRoomDto = { name: 'Room #1' };
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

      (usersService.findById as jest.Mock).mockImplementation(() => {
        throw exception;
      });

      await expect(roomsService.create(userId, createRoomDto)).rejects.toThrow(
        exception,
      );
      expect(usersService.findById).toHaveBeenCalledTimes(1);
      expect(usersService.findById).toHaveBeenCalledWith(userId);
      expect(roomModel.create).not.toHaveBeenCalled();
    });
  });
});
