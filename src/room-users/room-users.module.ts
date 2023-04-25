import { Module } from '@nestjs/common';
import { RoomUsersService } from './room-users.service';
import { RoomUsersController } from './room-users.controller';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  controllers: [RoomUsersController],
  providers: [RoomUsersService],
  imports: [RoomsModule],
})
export class RoomUsersModule {}
