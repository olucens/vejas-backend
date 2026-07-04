import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io';
import { AuthUser } from '../auth/auth-user.interface';
import { SupabaseJwtService } from '../auth/supabase-jwt.service';
import type { ChatMessagePayload, JoinRoomPayload, PlaybackUpdatePayload, PlaylistAddPayload, PlaylistRemovePayload, PlaylistSelectPayload } from './room.types';
import { RoomsService } from './rooms.service';
interface SocketData {
    user: AuthUser;
    roomId?: string;
}
type RoomSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>;
export declare class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly rooms;
    private readonly jwt;
    server: Server;
    private readonly logger;
    constructor(rooms: RoomsService, jwt: SupabaseJwtService);
    handleConnection(client: RoomSocket): Promise<void>;
    handleDisconnect(client: RoomSocket): void;
    onJoinRoom(client: RoomSocket, { roomId }: JoinRoomPayload): Promise<void>;
    onPlaybackUpdate(client: RoomSocket, { roomId, isPlaying, currentTime }: PlaybackUpdatePayload): void;
    onChatMessage(client: RoomSocket, { roomId, text }: ChatMessagePayload): void;
    onPlaylistAdd(client: RoomSocket, { roomId, videoId, url }: PlaylistAddPayload): void;
    onPlaylistSelect(client: RoomSocket, { roomId, index }: PlaylistSelectPayload): void;
    onPlaylistRemove(client: RoomSocket, { roomId, id }: PlaylistRemovePayload): void;
    private assertMember;
    private assertAdmin;
    private broadcastViewersCount;
}
export {};
