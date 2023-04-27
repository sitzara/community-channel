import { ApiProperty } from '@nestjs/swagger';
import { RoomMessage } from '../schemas/room-message.schema';

export class RoomMessageEntity extends RoomMessage {
  @ApiProperty()
  id: string;
}
