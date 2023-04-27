import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';

export type RoomMessageDocument = mongoose.HydratedDocument<RoomMessage>;

@Schema({ timestamps: true })
export class RoomMessage {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  roomId: string;

  @Prop({ type: User, ref: 'User' })
  user: User;

  @Prop()
  text: string;
}

export const RoomMessageSchema = SchemaFactory.createForClass(RoomMessage);
