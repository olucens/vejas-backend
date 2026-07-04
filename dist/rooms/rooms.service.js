"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const MESSAGES_KEPT_FOR_NEWCOMERS = 50;
let RoomsService = class RoomsService {
    rooms = new Map();
    list() {
        return [...this.rooms.values()]
            .map((entry) => entry.room)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    create(dto, admin) {
        const room = {
            id: (0, node_crypto_1.randomUUID)(),
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
    get(roomId) {
        return this.entry(roomId).room;
    }
    getWithState(roomId) {
        const { room, state } = this.entry(roomId);
        return { ...room, state };
    }
    delete(roomId, user) {
        const { room } = this.entry(roomId);
        if (room.adminId !== user.id) {
            throw new common_1.ForbiddenException('Only the room admin can delete the room');
        }
        this.rooms.delete(roomId);
    }
    exists(roomId) {
        return this.rooms.has(roomId);
    }
    isAdmin(roomId, userId) {
        return this.rooms.get(roomId)?.room.adminId === userId;
    }
    setViewersCount(roomId, count) {
        const entry = this.rooms.get(roomId);
        if (entry) {
            entry.room.viewersCount = count;
        }
    }
    setPlayback(roomId, isPlaying, currentTime) {
        this.entry(roomId).state.playback = {
            isPlaying,
            currentTime,
            updatedAt: new Date().toISOString(),
        };
    }
    addMessage(roomId, author, text) {
        const { state } = this.entry(roomId);
        const message = {
            id: (0, node_crypto_1.randomUUID)(),
            authorId: author.id,
            author: author.name ?? 'Unknown',
            text: text.trim(),
            sentAt: new Date().toISOString(),
        };
        state.messages.push(message);
        if (state.messages.length > MESSAGES_KEPT_FOR_NEWCOMERS) {
            state.messages.splice(0, state.messages.length - MESSAGES_KEPT_FOR_NEWCOMERS);
        }
        return message;
    }
    addPlaylistItem(roomId, videoId, url) {
        const { state } = this.entry(roomId);
        const item = { id: (0, node_crypto_1.randomUUID)(), videoId, url };
        state.playlist.push(item);
        if (state.playlist.length === 1) {
            state.currentIndex = 0;
        }
        return state;
    }
    selectPlaylistItem(roomId, index) {
        const { state } = this.entry(roomId);
        if (index >= 0 && index < state.playlist.length) {
            state.currentIndex = index;
        }
        return state;
    }
    removePlaylistItem(roomId, itemId) {
        const { state } = this.entry(roomId);
        const index = state.playlist.findIndex((item) => item.id === itemId);
        if (index === -1)
            return state;
        state.playlist = state.playlist.filter((item) => item.id !== itemId);
        if (index < state.currentIndex) {
            state.currentIndex -= 1;
        }
        else if (index === state.currentIndex) {
            state.currentIndex = Math.max(0, Math.min(state.currentIndex, state.playlist.length - 1));
        }
        return state;
    }
    entry(roomId) {
        const entry = this.rooms.get(roomId);
        if (!entry) {
            throw new common_1.NotFoundException(`Room ${roomId} not found`);
        }
        return entry;
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)()
], RoomsService);
//# sourceMappingURL=rooms.service.js.map