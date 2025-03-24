import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../auth/schemas/user.schema';

interface CreateUserData {
  email: string;
  name: string;
  document: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOrCreate(data: CreateUserData) {
    // Try to find existing user by email or document
    let user = await this.userModel.findOne({
      $or: [{ email: data.email }, { document: data.document }],
    });

    // If user doesn't exist, create a new one
    if (!user) {
      const password = Math.random().toString(36).slice(-8); // Generate random password
      const hashedPassword = await bcrypt.hash(password, 10);

      user = await this.userModel.create({
        email: data.email,
        password: hashedPassword,
        name: data.name,
        document: data.document,
      });
    }

    return user;
  }

  async update(userId: string, data: Partial<CreateUserData>) {
    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.document) updateData.document = data.document;

    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true });
  }
}
