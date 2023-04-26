import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomMessageDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  roomId: string;

  @ApiProperty()
  text: string;
}
