import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let moduleRef: TestingModule;
  let userController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return { create: jest.fn() };
        }
      })
      .compile();

    userController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should return created user', async () => {
      const createUserDto = { name: 'John Doe' };
      const userEntity = {
        id: '123',
        name: createUserDto.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (usersService.create as jest.Mock).mockResolvedValue(userEntity);

      const user = await userController.create(createUserDto);
      expect(usersService.create).toHaveBeenCalledTimes(1);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(user).toEqual(userEntity);
    });
  });
});
