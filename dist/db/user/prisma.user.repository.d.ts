import { PrismaService } from '../../prisma/prisma.service';
import { IUserRepository } from './user.repository.interface';
import { CreateUserDto, User as DomainUser, UpdatePasswordDto, UpdateProfileDto } from '../../user/dto/user.dto';
export declare class PrismaUserRepository implements IUserRepository {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<DomainUser[]>;
    getById(id: string): Promise<DomainUser | undefined>;
    getByLogin(login: string): Promise<DomainUser | undefined>;
    create(dto: CreateUserDto): Promise<DomainUser>;
    update(id: string, data: UpdatePasswordDto): Promise<DomainUser | undefined>;
    updateProfile(id: string, data: UpdateProfileDto): Promise<DomainUser | undefined>;
    delete(id: string): Promise<boolean>;
    private mapToDomain;
}
