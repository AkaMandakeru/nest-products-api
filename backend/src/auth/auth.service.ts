import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

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
    });

    // Generate token
    const token = this.jwtService.sign({ sub: user._id, email: user.email });

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
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
    const token = this.jwtService.sign({ sub: user._id, email: user.email });

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async validateUser(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { id: user._id, email: user.email, name: user.name };
  }
}
