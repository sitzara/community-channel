import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { RoomUsersService } from './room-users.service';
import { RoomUsersController } from './room-users.controller';
import { RoomUser, RoomUserSchema } from './schemas/room-user.schema';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoomUser.name, schema: RoomUserSchema },
    ]),
    UsersModule,
    RoomsModule,
  ],
  controllers: [RoomUsersController],
  providers: [RoomUsersService],
  exports: [RoomUsersService],
})
export class RoomUsersModule {}
