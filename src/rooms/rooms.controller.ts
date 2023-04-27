import { Controller, Get, Post, Param, Body, Req } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { AuthUserRequest } from '../common/types';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async create(
    @Body() createRoomDto: CreateRoomDto,
    @Req() req: AuthUserRequest,
  ) {
    const userId = req.user?.id;
    const result = await this.roomsService.create(userId, createRoomDto);

    return result;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findById(id);
  }
}
