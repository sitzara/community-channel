import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../..//users/schemas/user.schema';

export type RoomDocument = mongoose.HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true })
  name: string;

  @Prop({ type: User, ref: 'User' })
  createdBy: User;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
