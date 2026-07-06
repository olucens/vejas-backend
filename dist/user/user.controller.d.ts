import { CreateUserDto, UpdatePasswordDto, UpdateProfileDto } from './dto/user.dto';
import { UserService } from './user.service';
import type { JwtUser } from '../rooms/room.types';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<import("./dto/user.dto").UserResponse[]>;
    getMe(user: JwtUser): Promise<import("./dto/user.dto").UserResponse>;
    updateMe(user: JwtUser, body: UpdateProfileDto): Promise<import("./dto/user.dto").UserResponse>;
    getUserById(id: string): Promise<import("./dto/user.dto").UserResponse>;
    createUser(body: CreateUserDto): Promise<import("./dto/user.dto").UserResponse>;
    updatePassword(id: string, body: UpdatePasswordDto): Promise<import("./dto/user.dto").UserResponse>;
    deleteUser(id: string): Promise<void>;
}
