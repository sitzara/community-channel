import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomUsersModule } from './room-users/room-users.module';
import { RoomMessagesModule } from './room-messages/room-messages.module';

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`,
    ),
    UsersModule,
    RoomsModule,
    RoomUsersModule,
    RoomMessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
