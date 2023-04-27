import { ApiProperty } from '@nestjs/swagger';
import { Room } from '../schemas/room.schema';

export class RoomEntity extends Room {
  @ApiProperty()
  id: string;
}
