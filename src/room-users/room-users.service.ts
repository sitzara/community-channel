import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomUser } from './schemas/room-user.schema';
import { CreateRoomUserDto } from './dto/create-room-user.dto';
import { RoomUserEntity } from './entities/room-user.entity';
import { UsersService } from '../users/users.service';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class RoomUsersService {
  constructor(
    @InjectModel(RoomUser.name) private roomUserModel: Model<RoomUser>,
    private userService: UsersService,
    private roomsService: RoomsService,
  ) {}

  async create(
    roomId: string,
    createRoomUserDto: CreateRoomUserDto,
  ): Promise<RoomUserEntity> {
    const { userId } = createRoomUserDto;
    await this.roomsService.findById(roomId);
    const user = await this.userService.findById(userId);

    const roomUser = await this.findOne(roomId, userId);
    if (roomUser) {
      console.error(
        `User is already added to the room: roomId = ${roomId}, userId = ${userId}`,
      );
      throw new HttpException('Already added', HttpStatus.CONFLICT);
    }

    const result = await this.roomUserModel.create({
      roomId,
      userId: user.id,
      userName: user.name,
    });
    console.log('User added to the Room', result);

    return {
      id: result._id.toString(),
      roomId: result.roomId,
      userId: result.userId,
      userName: result.userName,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async findOne(roomId: string, userId: string): Promise<RoomUserEntity> {
    const result = await this.roomUserModel.findOne({ roomId, userId });
    if (!result) return null;
    return {
      id: result._id.toString(),
      roomId: result.roomId,
      userId: result.userId,
      userName: result.userName,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
