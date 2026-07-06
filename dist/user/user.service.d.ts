import { IUserRepository } from '../db/user/user.repository.interface';
import { CreateUserDto, UpdateProfileDto, UserResponse, UpdatePasswordDto, User } from './dto/user.dto';
export declare class UserService {
    private repository;
    constructor(repository: IUserRepository);
    getAll(): Promise<UserResponse[]>;
    getById(id: string): Promise<UserResponse>;
    getByLogin(login: string): Promise<User | undefined>;
    create(data: CreateUserDto): Promise<UserResponse>;
    update(id: string, data: UpdatePasswordDto): Promise<UserResponse>;
    updateProfile(id: string, data: UpdateProfileDto): Promise<UserResponse>;
    delete(id: string): Promise<void>;
}
