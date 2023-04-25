import { Injectable } from '@nestjs/common';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';

@Injectable()
export class RoomMessagesService {
  create(roomId: string, userId: string, createRoomMessageDto: CreateRoomMessageDto) {
    // TODO: create room message
    return 'This action adds a new roomMessage';
  }

  findAll(roomId: string, limit?: number) {
    // TODO: fetch room messages
    return `This action returns all roomMessages for roomId = ${roomId} amd limit = ${limit}`;
  }
}
