import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

describe('UsersService', () => {
  let moduleRef: TestingModule;
  let userController: UsersController;
  let usersService: UsersService;
  let userModel: Model<User>;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        // {
        //   provide: getModelToken(User.name),
        //   useValue: { create: jest.fn() },
        // },
      ],
    })
      .useMocker((token) => {
        if (token === getModelToken(User.name)) {
          return { findById: jest.fn(), create: jest.fn() };
        }
      })
      .compile();

    userController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
    userModel = moduleRef.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(usersService).toBeDefined();
    expect(userModel).toBeDefined();
  });

  describe('findById', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return found User', async () => {
      const id = '123';
      const userEntity = {
        name: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userModel.findById as jest.Mock).mockResolvedValue({
        _id: id,
        ...userEntity,
      });

      const user = await usersService.findById(id);
      expect(user).toEqual({
        id: id,
        ...userEntity,
      });
    });

    it('should throw HttpException if User is not found', async () => {
      const id = '456';
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

      (userModel.findById as jest.Mock).mockImplementation(() => {
        throw exception;
      });

      await expect(usersService.findById(id)).rejects.toThrow(exception);

      expect(userModel.findById).toHaveBeenCalledTimes(1);
      expect(userModel.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return created User', async () => {
      const createUserDto = { name: 'John Doe' };
      const userEntity = {
        name: createUserDto.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (userModel.create as jest.Mock).mockResolvedValue({
        _id: '123',
        ...userEntity,
      });

      const user = await usersService.create(createUserDto);
      expect(userModel.create).toHaveBeenCalledTimes(1);
      expect(userModel.create).toHaveBeenCalledWith(createUserDto);
      expect(user).toEqual({
        id: '123',
        ...userEntity,
      });
    });
  });
});
