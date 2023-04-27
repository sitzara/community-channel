import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';
import { RoomMessage } from './schemas/room-message.schema';
import { RoomMessageEntity } from './entities/room-user.entity';
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
  ): Promise<RoomMessageEntity> {
    const roomUser = await this.roomUsersService.findOne(roomId, userId);
    if (!roomUser) {
      console.error('Unauthorized to send messages to the room');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      return;
    }

    const { userName } = roomUser;
    const { text } = createRoomMessageDto;
    const message = await this.roomMessageModel.create({
      roomId,
      userId,
      userName,
      text,
    });

    console.log('Message added', message);
    return {
      id: message._id.toString(),
      roomId: message.roomId,
      userId: message.userId,
      userName: message.userName,
      text: message.text,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }

  async findAll(roomId: string, limit?: number): Promise<RoomMessageEntity[]> {
    const messages = await this.roomMessageModel.find(
      { roomId },
      null,
      limit ? { limit } : null,
    );

    return messages.map((m) => ({
      id: m._id.toString(),
      roomId: m.roomId,
      userId: m.userId,
      userName: m.userName,
      text: m.text,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));
  }
}
