import { Test, TestingModule } from '@nestjs/testing';
import { RoomMessagesController } from './room-messages.controller';
import { RoomMessagesService } from './room-messages.service';

describe('RoomMessagesController', () => {
  let controller: RoomMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomMessagesController],
      providers: [RoomMessagesService],
    }).compile();

    controller = module.get<RoomMessagesController>(RoomMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
