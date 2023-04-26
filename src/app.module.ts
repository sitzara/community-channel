import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomUsersModule } from './room-users/room-users.module';
import { RoomMessagesModule } from './room-messages/room-messages.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/local'),
    UsersModule,
    RoomsModule,
    RoomUsersModule,
    RoomMessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
