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
var RoomsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const supabase_jwt_service_1 = require("../auth/supabase-jwt.service");
const rooms_service_1 = require("./rooms.service");
let RoomsGateway = RoomsGateway_1 = class RoomsGateway {
    rooms;
    jwt;
    server;
    logger = new common_1.Logger(RoomsGateway_1.name);
    constructor(rooms, jwt) {
        this.rooms = rooms;
        this.jwt = jwt;
    }
    async handleConnection(client) {
        const token = client.handshake.auth?.token;
        if (!token) {
            client.disconnect(true);
            return;
        }
        try {
            client.data.user = await this.jwt.verify(token);
        }
        catch {
            this.logger.warn(`Rejected socket ${client.id}: invalid token`);
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        const { roomId } = client.data;
        if (roomId) {
            this.broadcastViewersCount(roomId);
        }
    }
    async onJoinRoom(client, { roomId }) {
        if (!this.rooms.exists(roomId)) {
            throw new websockets_1.WsException(`Room ${roomId} not found`);
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
    onPlaybackUpdate(client, { roomId, isPlaying, currentTime }) {
        this.assertAdmin(client, roomId);
        this.rooms.setPlayback(roomId, isPlaying, currentTime);
        client.to(roomId).emit('playbackUpdate', { isPlaying, currentTime });
    }
    onChatMessage(client, { roomId, text }) {
        this.assertMember(client, roomId);
        if (!text?.trim())
            return;
        const message = this.rooms.addMessage(roomId, client.data.user, text);
        this.server.to(roomId).emit('chatMessage', message);
    }
    onPlaylistAdd(client, { roomId, videoId, url }) {
        this.assertAdmin(client, roomId);
        const state = this.rooms.addPlaylistItem(roomId, videoId, url);
        this.server.to(roomId).emit('playlistUpdate', state);
    }
    onPlaylistSelect(client, { roomId, index }) {
        this.assertAdmin(client, roomId);
        const state = this.rooms.selectPlaylistItem(roomId, index);
        this.server.to(roomId).emit('playlistUpdate', state);
    }
    onPlaylistRemove(client, { roomId, id }) {
        this.assertAdmin(client, roomId);
        const state = this.rooms.removePlaylistItem(roomId, id);
        this.server.to(roomId).emit('playlistUpdate', state);
    }
    assertMember(client, roomId) {
        if (client.data.roomId !== roomId) {
            throw new websockets_1.WsException('Join the room first');
        }
    }
    assertAdmin(client, roomId) {
        this.assertMember(client, roomId);
        if (!this.rooms.isAdmin(roomId, client.data.user.id)) {
            throw new websockets_1.WsException('Only the room admin can do this');
        }
    }
    broadcastViewersCount(roomId) {
        if (!this.rooms.exists(roomId))
            return;
        const count = this.server.sockets.adapter.rooms.get(roomId)?.size ?? 0;
        this.rooms.setViewersCount(roomId, count);
        this.server.to(roomId).emit('viewersCount', { count });
    }
};
exports.RoomsGateway = RoomsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RoomsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoomsGateway.prototype, "onJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('playbackUpdate'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "onPlaybackUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chatMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "onChatMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('playlistAdd'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "onPlaylistAdd", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('playlistSelect'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "onPlaylistSelect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('playlistRemove'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RoomsGateway.prototype, "onPlaylistRemove", null);
exports.RoomsGateway = RoomsGateway = RoomsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: process.env.CORS_ORIGIN ?? '*' } }),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService,
        supabase_jwt_service_1.SupabaseJwtService])
], RoomsGateway);
//# sourceMappingURL=rooms.gateway.js.map