import { AuthUser } from '../auth/auth-user.interface';
import { CreateRoomDto } from './dto/create-room.dto';
import { ChatMessage, Room, RoomState, RoomWithState } from './room.types';
export declare class RoomsService {
    private readonly rooms;
    list(): Room[];
    create(dto: CreateRoomDto, admin: AuthUser): Room;
    get(roomId: string): Room;
    getWithState(roomId: string): RoomWithState;
    delete(roomId: string, user: AuthUser): void;
    exists(roomId: string): boolean;
    isAdmin(roomId: string, userId: string): boolean;
    setViewersCount(roomId: string, count: number): void;
    setPlayback(roomId: string, isPlaying: boolean, currentTime: number): void;
    addMessage(roomId: string, author: AuthUser, text: string): ChatMessage;
    addPlaylistItem(roomId: string, videoId: string, url: string): RoomState;
    selectPlaylistItem(roomId: string, index: number): RoomState;
    removePlaylistItem(roomId: string, itemId: string): RoomState;
    private entry;
}
