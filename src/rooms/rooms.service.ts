import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const { name } = createRoomDto;
    const result = await this.roomModel.create({ name });

    console.log('Room created', result);
    return result;
  }

  async findOne(id: string) {
    const result = await this.roomModel.findById(id);
    if (!result) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    console.log('Room found', result);
    return result;
  }
}
