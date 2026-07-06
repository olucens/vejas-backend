"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const room_state_service_1 = require("./room-state.service");
const user_service_1 = require("../user/user.service");
let RoomService = class RoomService {
    constructor(repository, roomState, userService) {
        this.repository = repository;
        this.roomState = roomState;
        this.userService = userService;
    }
    async findAll(adminId) {
        const rooms = await this.repository.findAll();
        const sorted = rooms
            .filter((room) => !adminId || room.adminId === adminId)
            .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
        return Promise.all(sorted.map((room) => this.toApiRoom(room)));
    }
    async findOne(id) {
        const item = await this.repository.findById(id);
        if (!item) {
            throw new common_1.NotFoundException(`Room with ID ${id} not found`);
        }
        return this.toApiRoom(item);
    }
    async findOneWithState(id) {
        const room = await this.findOne(id);
        const state = await this.roomState.getState(id);
        return { ...room, state };
    }
    async create(dto, adminId) {
        const room = await this.repository.create({ ...dto, adminId });
        return this.toApiRoom(room);
    }
    async update(id, dto, requesterId) {
        await this.assertAdmin(id, requesterId);
        const item = await this.repository.update(id, dto);
        if (!item) {
            throw new common_1.NotFoundException(`Room with ID ${id} not found`);
        }
        return this.toApiRoom(item);
    }
    async remove(id, requesterId) {
        await this.assertAdmin(id, requesterId);
        const deleted = await this.repository.delete(id);
        if (!deleted) {
            throw new common_1.NotFoundException(`Room with ID ${id} not found`);
        }
        await this.roomState.clear(id);
    }
    async assertAdmin(roomId, userId) {
        const room = await this.repository.findById(roomId);
        if (!room) {
            throw new common_1.NotFoundException(`Room with ID ${roomId} not found`);
        }
        if (room.adminId !== userId) {
            throw new common_1.ForbiddenException('Only the room admin can do this');
        }
    }
    async toApiRoom(room) {
        const [adminName, viewersCount] = await Promise.all([
            this.userService
                .getById(room.adminId)
                .then((user) => user.nickname ?? user.login.split('@')[0])
                .catch(() => 'Unknown'),
            this.roomState.getViewersCount(room.id),
        ]);
        return {
            id: room.id,
            name: room.name,
            description: room.description ?? '',
            coverUrl: room.coverUrl ?? null,
            adminId: room.adminId,
            adminName,
            createdAt: room.createdAt?.toISOString() ?? null,
            viewersCount,
        };
    }
};
exports.RoomService = RoomService;
exports.RoomService = RoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ROOM_REPOSITORY')),
    __metadata("design:paramtypes", [Object, room_state_service_1.RoomStateService,
        user_service_1.UserService])
], RoomService);
//# sourceMappingURL=rooms.service.js.map