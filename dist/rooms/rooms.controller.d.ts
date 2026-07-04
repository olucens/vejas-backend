import type { AuthUser } from '../auth/auth-user.interface';
import { CreateRoomDto } from './dto/create-room.dto';
import type { Room, RoomWithState } from './room.types';
import { RoomsService } from './rooms.service';
export declare class RoomsController {
    private readonly rooms;
    constructor(rooms: RoomsService);
    list(): Room[];
    get(id: string): RoomWithState;
    create(dto: CreateRoomDto, user: AuthUser): Room;
    delete(id: string, user: AuthUser): void;
}
