import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let moduleRef: TestingModule;
  let userController: UsersController;

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
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create', () => {
    it('should return created user', async () => {
      const result = {
        id: '123',
        name: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (moduleRef.get(UsersService).create as jest.Mock).mockResolvedValue(
        result,
      );

      const user = await userController.create({ name: result.name });
      expect(user).toEqual(result);
    });
  });
});
