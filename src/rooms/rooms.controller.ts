import { Controller, Get, Post, Param, Body, Req } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { RoomEntity } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { AuthUserRequest } from '../common/types';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiCreatedResponse({ description: 'Created', type: RoomEntity })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post()
  async create(
    @Body() createRoomDto: CreateRoomDto,
    @Req() req: AuthUserRequest,
  ): Promise<RoomEntity> {
    const userId = req.user?.id;
    return this.roomsService.create(userId, createRoomDto);
  }

  @ApiOkResponse({ description: 'Found', type: RoomEntity })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findById(id);
  }
}
