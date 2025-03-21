import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: unknown;
            email: string;
            name: string;
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: unknown;
            email: string;
            name: string;
        };
        token: string;
    }>;
    validateUser(userId: string): Promise<any>;
}
