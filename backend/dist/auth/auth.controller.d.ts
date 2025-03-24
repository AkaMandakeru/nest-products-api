import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponse } from './interfaces/user-response.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: UserResponse;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: UserResponse;
        token: string;
    }>;
    getProfile(req: any): Promise<UserResponse>;
}
