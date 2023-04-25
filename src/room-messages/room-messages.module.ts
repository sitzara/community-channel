import { Module } from '@nestjs/common';
import { RoomMessagesService } from './room-messages.service';
import { RoomMessagesController } from './room-messages.controller';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [RoomsModule],
  controllers: [RoomMessagesController],
  providers: [RoomMessagesService],
})
export class RoomMessagesModule {}
