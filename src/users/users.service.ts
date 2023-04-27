import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { name } = createUserDto;
    const user = await this.userModel.create({ name });

    console.log('User created', user);
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
      console.error('User not found: id = ', id);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    console.log('User found', user);
    return {
      id: user._id.toString(),
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
