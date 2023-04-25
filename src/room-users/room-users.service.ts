import { Injectable } from '@nestjs/common';
import { CreateRoomUserDto } from './dto/create-room-user.dto';

@Injectable()
export class RoomUsersService {
  create(roomId: string, createRoomUserDto: CreateRoomUserDto) {
    // TODO: create room user
    return 'This action adds a new roomUser';
  }
}
