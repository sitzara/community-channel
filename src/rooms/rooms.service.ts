import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    private userService: UsersService,
  ) {}

  async create(userId: string, createRoomDto: CreateRoomDto): Promise<Room> {
    const user = await this.userService.findById(userId);

    const { name } = createRoomDto;
    const result = await this.roomModel.create({ name, createdBy: user });

    console.log('Room created', result);
    return result;
  }

  async findById(id: string) {
    const room = await this.roomModel.findById(id);
    if (!room) {
      console.log('Room not found: id = ', id);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    console.log('Room found', room);
    return room;
  }
}
