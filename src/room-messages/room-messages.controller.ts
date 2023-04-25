import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RoomMessagesService } from './room-messages.service';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';

@Controller('rooms/:id/messages')
export class RoomMessagesController {
  constructor(private readonly roomMessagesService: RoomMessagesService) {}

  @Post()
  create(
    @Param('id') id: string,
    @Body() createRoomMessageDto: CreateRoomMessageDto,
  ) {
    // TODO: get userId
    const userId = '';
    return this.roomMessagesService.create(id, userId, createRoomMessageDto);
  }

  @Get()
  findAll(@Param('id') id: string, @Query('limit') limit: number) {
    return this.roomMessagesService.findAll(id, limit);
  }
}
