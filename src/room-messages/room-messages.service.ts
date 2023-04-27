import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';
import { RoomMessage } from './schemas/room-message.schema';
import { RoomUsersService } from '../room-users/room-users.service';

@Injectable()
export class RoomMessagesService {
  constructor(
    @InjectModel(RoomMessage.name) private roomMessageModel: Model<RoomMessage>,
    private roomUsersService: RoomUsersService,
  ) {}

  async create(
    roomId: string,
    userId: string,
    createRoomMessageDto: CreateRoomMessageDto,
  ) {
    const roomUser = await this.roomUsersService.findOne(roomId, userId);
    if (!roomUser) {
      // TODO: throw HttpError
      return;
    }

    const { user } = roomUser;
    const { text } = createRoomMessageDto;
    const message = await this.roomMessageModel.create({ roomId, user, text });

    console.log('Message added', message);
    return message;
  }

  async findAll(roomId: string, limit?: number) {
    const messages = this.roomMessageModel.find(
      { roomId },
      null,
      limit ? { limit } : null,
    );

    return messages;
  }
}
