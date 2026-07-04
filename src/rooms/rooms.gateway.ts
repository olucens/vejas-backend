import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io';
import { AuthUser } from '../auth/auth-user.interface';
import { SupabaseJwtService } from '../auth/supabase-jwt.service';
import type {
  ChatMessagePayload,
  JoinRoomPayload,
  PlaybackUpdatePayload,
  PlaylistAddPayload,
  PlaylistRemovePayload,
  PlaylistSelectPayload,
} from './room.types';
import { RoomsService } from './rooms.service';

interface SocketData {
  user: AuthUser;
  roomId?: string;
}

type RoomSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>;

@WebSocketGateway({ cors: { origin: process.env.CORS_ORIGIN ?? '*' } })
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RoomsGateway.name);

  constructor(
    private readonly rooms: RoomsService,
    private readonly jwt: SupabaseJwtService,
  ) {}

  async handleConnection(client: RoomSocket): Promise<void> {
    const token = client.handshake.auth?.token as string | undefined;
    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      client.data.user = await this.jwt.verify(token);
    } catch {
      this.logger.warn(`Rejected socket ${client.id}: invalid token`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: RoomSocket): void {
    const { roomId } = client.data;
    if (roomId) {
      // The socket already left the socket.io room, so recount the rest.
      this.broadcastViewersCount(roomId);
    }
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(
    @ConnectedSocket() client: RoomSocket,
    @MessageBody() { roomId }: JoinRoomPayload,
  ): Promise<void> {
    if (!this.rooms.exists(roomId)) {
      throw new WsException(`Room ${roomId} not found`);
    }

    if (client.data.roomId && client.data.roomId !== roomId) {
      await client.leave(client.data.roomId);
      this.broadcastViewersCount(client.data.roomId);
    }

    client.data.roomId = roomId;
    await client.join(roomId);
    this.broadcastViewersCount(roomId);

    client.emit('roomState', this.rooms.getWithState(roomId));
  }

  @SubscribeMessage('playbackUpdate')
  onPlaybackUpdate(
    @ConnectedSocket() client: RoomSocket,
    @MessageBody() { roomId, isPlaying, currentTime }: PlaybackUpdatePayload,
  ): void {
    this.assertAdmin(client, roomId);
    this.rooms.setPlayback(roomId, isPlaying, currentTime);
    client.to(roomId).emit('playbackUpdate', { isPlaying, currentTime });
  }

  @SubscribeMessage('chatMessage')
  onChatMessage(
    @ConnectedSocket() client: RoomSocket,
    @MessageBody() { roomId, text }: ChatMessagePayload,
  ): void {
    this.assertMember(client, roomId);
    if (!text?.trim()) return;

    const message = this.rooms.addMessage(roomId, client.data.user, text);
    this.server.to(roomId).emit('chatMessage', message);
  }

  @SubscribeMessage('playlistAdd')
  onPlaylistAdd(
    @ConnectedSocket() client: RoomSocket,
    @MessageBody() { roomId, videoId, url }: PlaylistAddPayload,
  ): void {
    this.assertAdmin(client, roomId);
    const state = this.rooms.addPlaylistItem(roomId, videoId, url);
    this.server.to(roomId).emit('playlistUpdate', state);
  }

  @SubscribeMessage('playlistSelect')
  onPlaylistSelect(
    @ConnectedSocket() client: RoomSocket,
    @MessageBody() { roomId, index }: PlaylistSelectPayload,
  ): void {
    this.assertAdmin(client, roomId);
    const state = this.rooms.selectPlaylistItem(roomId, index);
    this.server.to(roomId).emit('playlistUpdate', state);
  }

  @SubscribeMessage('playlistRemove')
  onPlaylistRemove(
    @ConnectedSocket() client: RoomSocket,
    @MessageBody() { roomId, id }: PlaylistRemovePayload,
  ): void {
    this.assertAdmin(client, roomId);
    const state = this.rooms.removePlaylistItem(roomId, id);
    this.server.to(roomId).emit('playlistUpdate', state);
  }

  private assertMember(client: RoomSocket, roomId: string): void {
    if (client.data.roomId !== roomId) {
      throw new WsException('Join the room first');
    }
  }

  private assertAdmin(client: RoomSocket, roomId: string): void {
    this.assertMember(client, roomId);
    if (!this.rooms.isAdmin(roomId, client.data.user.id)) {
      throw new WsException('Only the room admin can do this');
    }
  }

  private broadcastViewersCount(roomId: string): void {
    if (!this.rooms.exists(roomId)) return;
    const count = this.server.sockets.adapter.rooms.get(roomId)?.size ?? 0;
    this.rooms.setViewersCount(roomId, count);
    this.server.to(roomId).emit('viewersCount', { count });
  }
}
