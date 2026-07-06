"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomModule = void 0;
const common_1 = require("@nestjs/common");
const rooms_controller_1 = require("./rooms.controller");
const rooms_service_1 = require("./rooms.service");
const prisma_module_1 = require("../prisma/prisma.module");
const rooms_repository_1 = require("./rooms.repository");
const room_state_service_1 = require("./room-state.service");
const rooms_gateway_1 = require("./rooms.gateway");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
let RoomModule = class RoomModule {
};
exports.RoomModule = RoomModule;
exports.RoomModule = RoomModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, user_module_1.UserModule],
        controllers: [rooms_controller_1.RoomController],
        providers: [
            {
                provide: 'ROOM_REPOSITORY',
                useClass: rooms_repository_1.PrismaRoomRepository,
            },
            rooms_service_1.RoomService,
            room_state_service_1.RoomStateService,
            rooms_gateway_1.RoomsGateway,
        ],
        exports: [rooms_service_1.RoomService],
    })
], RoomModule);
//# sourceMappingURL=rooms.module.js.map