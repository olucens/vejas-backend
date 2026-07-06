export interface User {
    id: string;
    login: string;
    password: string;
    nickname: string | null;
    avatarUrl: string | null;
    roles: string[];
    version: number;
    createdAt: number;
    updatedAt: number;
}
export declare class CreateUserDto {
    login: string;
    password: string;
}
export declare class UpdateProfileDto {
    nickname?: string;
    avatarUrl?: string;
}
export declare class UpdatePasswordDto {
    oldPassword: string;
    newPassword: string;
}
export declare class UserResponse {
    id: string;
    login: string;
    nickname: string | null;
    avatarUrl: string | null;
    roles: string[];
    version: number;
    createdAt: number;
    updatedAt: number;
    password: string;
}
