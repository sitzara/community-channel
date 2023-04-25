import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './rooms/rooms.module';
import { RoomUsersModule } from './room-users/room-users.module';
import { RoomMessagesModule } from './room-messages/room-messages.module';

@Module({
  imports: [RoomsModule, RoomUsersModule, RoomMessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
