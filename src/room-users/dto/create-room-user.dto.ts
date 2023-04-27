import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}
