import { ApiRoom, ApiRoomWithState, RoomService } from './rooms.service';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateRoomDto } from './dto/update-rooms.dto';
import type { JwtUser } from './room.types';
export declare class RoomController {
    private readonly roomsService;
    constructor(roomsService: RoomService);
    findAll(adminId?: string): Promise<ApiRoom[]>;
    findOne(id: string): Promise<ApiRoomWithState>;
    create(dto: CreateRoomDto, user: JwtUser): Promise<ApiRoom>;
    update(id: string, dto: UpdateRoomDto, user: JwtUser): Promise<ApiRoom>;
    remove(id: string, user: JwtUser): Promise<void>;
}
