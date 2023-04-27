import { Controller, Post, Body, Param } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { RoomUsersService } from './room-users.service';
import { CreateRoomUserDto } from './dto/create-room-user.dto';

@Controller('rooms/:id/users')
export class RoomUsersController {
  constructor(private readonly roomUsersService: RoomUsersService) {}

  @ApiCreatedResponse({ description: 'Added to room' })
  @ApiConflictResponse({ description: 'Already added' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Post()
  async create(
    @Param('id') id: string,
    @Body() createRoomUserDto: CreateRoomUserDto,
  ): Promise<void> {
    await this.roomUsersService.create(id, createRoomUserDto);
  }
}
