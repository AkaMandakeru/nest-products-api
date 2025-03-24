import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface UserDocument extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  document: string;
  companyId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class User {
  _id: Types.ObjectId;

  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  document: string;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_, converted) => {
    delete converted._id;
    delete converted.__v;
    return converted;
  },
});
