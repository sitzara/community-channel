import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';

export type RoomUserDocument = mongoose.HydratedDocument<RoomUser>;

@Schema({ timestamps: true })
export class RoomUser {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  roomId: string;

  @Prop({ type: User, ref: 'User' })
  user: User;
}

export const RoomUserSchema = SchemaFactory.createForClass(RoomUser);
