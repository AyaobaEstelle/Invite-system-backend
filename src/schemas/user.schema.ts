import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ default: false })
  is_verified: boolean;
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  invited_by: Types.ObjectId;

  @Prop({ enum: ['admin', 'employee'] })
  role: string;

  @Prop({ default: false })
  can_invite: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Invite' }] })
  invites: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  employees: Types.ObjectId[];
}

export const AdminSchema = SchemaFactory.createForClass(User);
