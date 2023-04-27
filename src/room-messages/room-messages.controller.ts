import { Controller, Get, Post, Body, Param, Query, Req } from '@nestjs/common';
import { RoomMessagesService } from './room-messages.service';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';
import { AuthUserRequest } from '../common/types';

@Controller('rooms/:id/messages')
export class RoomMessagesController {
  constructor(private readonly roomMessagesService: RoomMessagesService) {}

  @Post()
  create(
    @Param('id') id: string,
    @Body() createRoomMessageDto: CreateRoomMessageDto,
    @Req() req: AuthUserRequest,
  ) {
    const userId = req.user?.id;
    return this.roomMessagesService.create(id, userId, createRoomMessageDto);
  }

  @Get()
  findAll(@Param('id') id: string, @Query('limit') limit: number) {
    return this.roomMessagesService.findAll(id, limit);
  }
}
