import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';
import { RoomMessagesService } from './room-messages.service';
import { RoomMessagesController } from './room-messages.controller';
import { RoomMessage, RoomMessageSchema } from './schemas/room-message.schema';
import { RoomsModule } from '../rooms/rooms.module';
import { RoomUsersModule } from '../room-users/room-users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoomMessage.name, schema: RoomMessageSchema },
    ]),
    RoomsModule,
    RoomUsersModule,
  ],
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
