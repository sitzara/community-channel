import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomUserDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  roomId: string;
}
