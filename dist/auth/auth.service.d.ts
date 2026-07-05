import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    signup(createUserDto: CreateUserDto): Promise<import("../user/dto/user.dto").UserResponse>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private generateTokens;
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
