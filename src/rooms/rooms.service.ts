import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  create(createRoomDto: CreateRoomDto): string {
    // TODO: create Room
    return 'This action adds a new room';
  }

  findOne(id: string) {
    // TODO: fetch Room by id
    return `This action returns a #${id} room`;
  }
}
