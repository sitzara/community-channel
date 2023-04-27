import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;
}
