import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomUser } from './schemas/room-user.schema';
import { CreateRoomUserDto } from './dto/create-room-user.dto';
import { UsersService } from '../users/users.service';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class RoomUsersService {
  constructor(
    @InjectModel(RoomUser.name) private roomUserModel: Model<RoomUser>,
    private userService: UsersService,
    private roomsService: RoomsService,
  ) {}

  async create(roomId: string, createRoomUserDto: CreateRoomUserDto) {
    const { userId } = createRoomUserDto;
    await this.roomsService.findById(roomId);
    const user = await this.userService.findById(userId);

    const roomUser = await this.findOne(roomId, userId);
    if (roomUser) {
      // TODO: return code other then 201
      return;
    }

    const result = await this.roomUserModel.create({ roomId, user });
    console.log('User added to the Room', result);

    return result;
  }

  async findOne(roomId: string, userId: string) {
    return this.roomUserModel.findOne({ roomId, 'user._id': userId });
  }
}
