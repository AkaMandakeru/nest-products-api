import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  _id: Types.ObjectId;

  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  document: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
