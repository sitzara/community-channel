import { Logger, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { name } = createUserDto;
    const user = await this.userModel.create({ name });

    this.logger.log(`User created: ${user}`);
    return {
      id: user._id.toString(),
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userModel.findById(id);
    if (!user) {
      this.logger.log(`User not found: id = ${id}`);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    this.logger.log(`User found: ${user}`);
    return {
      id: user._id.toString(),
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
