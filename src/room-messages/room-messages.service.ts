import { Logger, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';
import { RoomMessage } from './schemas/room-message.schema';
import { RoomMessageEntity } from './entities/room-user.entity';
import { RoomUsersService } from '../room-users/room-users.service';

@Injectable()
export class RoomMessagesService {
  private readonly logger = new Logger(RoomMessagesService.name);

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
      /*
       * User is being checked here if they are in the specified Room
       * and authorized to send messages there.
       * In real life application it's better move this logic to some
       * RoomAuthorization middleware and set it for all the endpoints
       * with Room specific logic:
       * - sending messages
       * - invite other users to the Room
       * - leaving the Room etc.
       */
      this.logger.log(
        `User doesn\'t belong to the Room: roomId = ${roomId}, userId = ${userId}`,
      );
      throw new HttpException('Not acceptable', HttpStatus.NOT_ACCEPTABLE);
    }

    const { userName } = roomUser;
    const { text } = createRoomMessageDto;
    const message = await this.roomMessageModel.create({
      roomId,
      userId,
      userName,
      text,
    });

    this.logger.log(`Message added: ${message}`);
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
    let query = this.roomMessageModel
      .find({ roomId })
      .sort({ createdAt: 'desc' });

    if (limit) {
      query = query.limit(limit);
    }

    const messages = await query;

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
