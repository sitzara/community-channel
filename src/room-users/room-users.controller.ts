import { Controller, Post, Body, Param } from '@nestjs/common';
import { RoomUsersService } from './room-users.service';
import { CreateRoomUserDto } from './dto/create-room-user.dto';

@Controller('rooms/:id/users')
export class RoomUsersController {
  constructor(private readonly roomUsersService: RoomUsersService) {}

  @Post()
  async create(
    @Param('id') id: string,
    @Body() createRoomUserDto: CreateRoomUserDto,
  ) {
    await this.roomUsersService.create(id, createRoomUserDto);
  }
}
