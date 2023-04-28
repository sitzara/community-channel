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
        {
          provide: getModelToken(User.name),
          useValue: { create: jest.fn() },
        },
      ],
    })
      .useMocker((token) => {
        if (token === getModelToken(User.name)) {
          console.log('MOCK');
          return { create: jest.fn() };
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

  describe('create', () => {
    it('should return created user', async () => {
      const result = {
        id: '123',
        name: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (
        moduleRef.get(getModelToken(User.name)).create as jest.Mock
      ).mockResolvedValue({
        _id: '123',
        name: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const user = await usersService.create({ name: result.name });
      expect(user).toEqual(result);
    });
  });
});
