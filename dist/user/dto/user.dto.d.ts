export interface User {
    id: string;
    login: string;
    password: string;
    roles: string[];
    version: number;
    createdAt: number;
    updatedAt: number;
}
export declare class CreateUserDto {
    login: string;
    password: string;
}
export declare class UpdatePasswordDto {
    oldPassword: string;
    newPassword: string;
}
export declare class UserResponse {
    id: string;
    login: string;
    roles: string[];
    version: number;
    createdAt: number;
    updatedAt: number;
    password: string;
}
