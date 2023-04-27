import { ApiProperty } from '@nestjs/swagger';
import { RoomUser } from '../schemas/room-user.schema';

export class RoomUserEntity extends RoomUser {
  @ApiProperty()
  id: string;
}
