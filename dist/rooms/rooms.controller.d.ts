import { RoomService } from './rooms.service';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateRoomDto } from './dto/update-rooms.dto';
export declare class RoomController {
    private readonly roomsService;
    constructor(roomsService: RoomService);
    findAll(): Promise<import("./entities/rooms.entity").Room[]>;
    findOne(id: string): Promise<import("./entities/rooms.entity").Room>;
    create(dto: CreateRoomDto): Promise<import("./entities/rooms.entity").Room>;
    update(id: string, dto: UpdateRoomDto): Promise<import("./entities/rooms.entity").Room>;
    remove(id: string): Promise<void>;
}
