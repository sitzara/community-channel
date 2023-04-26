// import { Module } from '@nestjs/common';
import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';
import { RoomMessagesService } from './room-messages.service';
import { RoomMessagesController } from './room-messages.controller';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [RoomsModule],
  controllers: [RoomMessagesController],
  providers: [RoomMessagesService],
})
export class RoomMessagesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'rooms/:id/messages', method: RequestMethod.POST });
  }
}
