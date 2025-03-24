import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { LoginDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponse } from './interfaces/user-response.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  private toUserResponse(user: UserDocument): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      document: user.document,
      companyId: user.companyId?.toString() || '',
    };
  }

  async register(registerDto: RegisterDto): Promise<{ user: UserResponse; token: string }> {
    const { email, password, name, document } = registerDto;

    // Check if user exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
      document,
    });

    // Generate token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      user: this.toUserResponse(user),
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: UserResponse; token: string }> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      user: this.toUserResponse(user),
      token,
    };
  }

  async validateUser(userId: string): Promise<UserResponse> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.toUserResponse(user);
  }
}
