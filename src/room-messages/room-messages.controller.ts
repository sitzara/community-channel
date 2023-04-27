import { Controller, Get, Post, Body, Param, Query, Req } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { RoomMessagesService } from './room-messages.service';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';
import { RoomMessageEntity } from './entities/room-user.entity';
import { AuthUserRequest } from '../common/types';

@Controller('rooms/:id/messages')
export class RoomMessagesController {
  constructor(private readonly roomMessagesService: RoomMessagesService) {}

  @ApiCreatedResponse({ description: 'Created', type: RoomMessageEntity })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Post()
  create(
    @Param('id') id: string,
    @Body() createRoomMessageDto: CreateRoomMessageDto,
    @Req() req: AuthUserRequest,
  ): Promise<RoomMessageEntity> {
    const userId = req.user?.id;
    return this.roomMessagesService.create(id, userId, createRoomMessageDto);
  }

  @ApiOkResponse({ description: 'Found', type: [RoomMessageEntity] })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get()
  findAll(
    @Param('id') id: string,
    @Query('limit') limit: number,
  ): Promise<RoomMessageEntity[]> {
    return this.roomMessagesService.findAll(id, limit);
  }
}
