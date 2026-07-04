import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AuthUser } from '../auth/auth-user.interface';
import { CreateRoomDto } from './dto/create-room.dto';
import {
  ChatMessage,
  PlaylistItem,
  Room,
  RoomState,
  RoomWithState,
} from './room.types';

const MESSAGES_KEPT_FOR_NEWCOMERS = 50;

interface RoomEntry {
  room: Room;
  state: RoomState;
}

@Injectable()
export class RoomsService {
  private readonly rooms = new Map<string, RoomEntry>();

  list(): Room[] {
    return [...this.rooms.values()]
      .map((entry) => entry.room)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  create(dto: CreateRoomDto, admin: AuthUser): Room {
    const room: Room = {
      id: randomUUID(),
      name: dto.name.trim(),
      description: dto.description?.trim() ?? '',
      coverUrl: dto.coverUrl ?? null,
      adminId: admin.id,
      adminName: admin.name ?? 'Unknown',
      createdAt: new Date().toISOString(),
      viewersCount: 0,
    };

    this.rooms.set(room.id, {
      room,
      state: {
        playlist: [],
        currentIndex: 0,
        playback: {
          isPlaying: false,
          currentTime: 0,
          updatedAt: room.createdAt,
        },
        messages: [],
      },
    });

    return room;
  }

  get(roomId: string): Room {
    return this.entry(roomId).room;
  }

  getWithState(roomId: string): RoomWithState {
    const { room, state } = this.entry(roomId);
    return { ...room, state };
  }

  delete(roomId: string, user: AuthUser): void {
    const { room } = this.entry(roomId);
    if (room.adminId !== user.id) {
      throw new ForbiddenException('Only the room admin can delete the room');
    }
    this.rooms.delete(roomId);
  }

  exists(roomId: string): boolean {
    return this.rooms.has(roomId);
  }

  isAdmin(roomId: string, userId: string): boolean {
    return this.rooms.get(roomId)?.room.adminId === userId;
  }

  setViewersCount(roomId: string, count: number): void {
    const entry = this.rooms.get(roomId);
    if (entry) {
      entry.room.viewersCount = count;
    }
  }

  setPlayback(roomId: string, isPlaying: boolean, currentTime: number): void {
    this.entry(roomId).state.playback = {
      isPlaying,
      currentTime,
      updatedAt: new Date().toISOString(),
    };
  }

  addMessage(roomId: string, author: AuthUser, text: string): ChatMessage {
    const { state } = this.entry(roomId);
    const message: ChatMessage = {
      id: randomUUID(),
      authorId: author.id,
      author: author.name ?? 'Unknown',
      text: text.trim(),
      sentAt: new Date().toISOString(),
    };
    state.messages.push(message);
    if (state.messages.length > MESSAGES_KEPT_FOR_NEWCOMERS) {
      state.messages.splice(
        0,
        state.messages.length - MESSAGES_KEPT_FOR_NEWCOMERS,
      );
    }
    return message;
  }

  addPlaylistItem(roomId: string, videoId: string, url: string): RoomState {
    const { state } = this.entry(roomId);
    const item: PlaylistItem = { id: randomUUID(), videoId, url };
    state.playlist.push(item);
    if (state.playlist.length === 1) {
      state.currentIndex = 0;
    }
    return state;
  }

  selectPlaylistItem(roomId: string, index: number): RoomState {
    const { state } = this.entry(roomId);
    if (index >= 0 && index < state.playlist.length) {
      state.currentIndex = index;
    }
    return state;
  }

  removePlaylistItem(roomId: string, itemId: string): RoomState {
    const { state } = this.entry(roomId);
    const index = state.playlist.findIndex((item) => item.id === itemId);
    if (index === -1) return state;

    state.playlist = state.playlist.filter((item) => item.id !== itemId);
    if (index < state.currentIndex) {
      state.currentIndex -= 1;
    } else if (index === state.currentIndex) {
      state.currentIndex = Math.max(
        0,
        Math.min(state.currentIndex, state.playlist.length - 1),
      );
    }
    return state;
  }

  private entry(roomId: string): RoomEntry {
    const entry = this.rooms.get(roomId);
    if (!entry) {
      throw new NotFoundException(`Room ${roomId} not found`);
    }
    return entry;
  }
}
