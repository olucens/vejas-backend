import { IRoomRepository } from './rooms.repository.interface';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateRoomDto } from './dto/update-rooms.dto';
import { RoomStateService } from './room-state.service';
import { RoomLiveState } from './room.types';
import { UserService } from '../user/user.service';
export interface ApiRoom {
    id: string;
    name: string;
    description: string;
    coverUrl: string | null;
    adminId: string;
    adminName: string;
    createdAt: string | null;
    viewersCount: number;
}
export interface ApiRoomWithState extends ApiRoom {
    state: RoomLiveState;
}
export declare class RoomService {
    private repository;
    private readonly roomState;
    private readonly userService;
    constructor(repository: IRoomRepository, roomState: RoomStateService, userService: UserService);
    findAll(adminId?: string): Promise<ApiRoom[]>;
    findOne(id: string): Promise<ApiRoom>;
    findOneWithState(id: string): Promise<ApiRoomWithState>;
    create(dto: CreateRoomDto, adminId: string): Promise<ApiRoom>;
    update(id: string, dto: UpdateRoomDto, requesterId: string): Promise<ApiRoom>;
    remove(id: string, requesterId: string): Promise<void>;
    private assertAdmin;
    private toApiRoom;
}
