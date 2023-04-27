import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schemas/room.schema';
import { RoomEntity } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    private userService: UsersService,
  ) {}

  async create(
    userId: string,
    createRoomDto: CreateRoomDto,
  ): Promise<RoomEntity> {
    const user = await this.userService.findById(userId);

    const { name } = createRoomDto;
    const room = await this.roomModel.create({
      name,
      creatorId: user.id,
    });

    console.log('Room created', room);
    return {
      id: room._id.toString(),
      name: room.name,
      creatorId: room.creatorId,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
  }

  async findById(id: string): Promise<RoomEntity> {
    const room = await this.roomModel.findById(id);
    if (!room) {
      console.error('Room not found: id = ', id);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    console.log('Room found', room);
    return {
      id: room._id.toString(),
      name: room.name,
      creatorId: room.creatorId,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
  }
}
