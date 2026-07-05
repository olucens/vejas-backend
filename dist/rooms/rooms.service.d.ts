import { IRoomRepository } from './rooms.repository.interface';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateRoomDto } from './dto/update-rooms.dto';
export declare class RoomService {
    private repository;
    constructor(repository: IRoomRepository);
    findAll(parentId?: string): Promise<import("./entities/rooms.entity").Room[]>;
    findOne(id: string): Promise<import("./entities/rooms.entity").Room>;
    create(createRoomDto: CreateRoomDto, parentId?: string): Promise<import("./entities/rooms.entity").Room>;
    update(id: string, updateRoomDto: UpdateRoomDto): Promise<import("./entities/rooms.entity").Room>;
    remove(id: string): Promise<void>;
}
