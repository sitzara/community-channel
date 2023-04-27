import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name } = createUserDto;
    const user = await this.userModel.create({ name });

    console.log('User created', user);
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      console.log('User not found: id = ', id);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    console.log('User found', user);
    return user;
  }
}
