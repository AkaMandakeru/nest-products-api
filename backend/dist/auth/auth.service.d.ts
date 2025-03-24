import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { LoginDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponse } from './interfaces/user-response.interface';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    private toUserResponse;
    register(registerDto: RegisterDto): Promise<{
        user: UserResponse;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: UserResponse;
        token: string;
    }>;
    validateUser(userId: string): Promise<UserResponse>;
}
