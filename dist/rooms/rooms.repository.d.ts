import { PrismaService } from '../prisma/prisma.service';
import { IRoomRepository } from './rooms.repository.interface';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateRoomDto } from './dto/update-rooms.dto';
import { Room } from './entities/rooms.entity';
export declare class PrismaRoomRepository implements IRoomRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(parentId?: string): Promise<Room[]>;
    findById(id: string | number): Promise<Room | undefined>;
    create(data: CreateRoomDto, parentId?: string): Promise<Room>;
    update(id: string | number, data: UpdateRoomDto): Promise<Room | undefined>;
    delete(id: string | number): Promise<boolean>;
    private mapToDomain;
}
