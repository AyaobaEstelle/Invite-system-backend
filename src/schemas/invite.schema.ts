import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InviteDocument = Invite & Document;

@Schema({ timestamps: true })
export class Invite extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  invitedBy: Types.ObjectId;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ default: false })
  used: boolean;

  @Prop({ default: null })
  usedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  usedBy: Types.ObjectId;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
