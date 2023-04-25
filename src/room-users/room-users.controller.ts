import { Controller, Post, Body, Param } from '@nestjs/common';
import { RoomUsersService } from './room-users.service';
import { CreateRoomUserDto } from './dto/create-room-user.dto';

@Controller('rooms/:id/users')
export class RoomUsersController {
  constructor(private readonly roomUsersService: RoomUsersService) {}

  @Post()
  create(
    @Param('id') id: string,
    @Body() createRoomUserDto: CreateRoomUserDto,
  ) {
    return this.roomUsersService.create(id, createRoomUserDto);
  }
}
