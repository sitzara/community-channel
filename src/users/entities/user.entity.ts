import { ApiProperty } from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

export class UserEntity extends User {
  @ApiProperty()
  id: string;
}
