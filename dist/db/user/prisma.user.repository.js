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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PrismaUserRepository = class PrismaUserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll() {
        const users = await this.prisma.user.findMany();
        return users.map((user) => this.mapToDomain(user));
    }
    async getById(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return user ? this.mapToDomain(user) : undefined;
    }
    async getByLogin(login) {
        const user = await this.prisma.user.findFirst({ where: { login } });
        return user ? this.mapToDomain(user) : undefined;
    }
    async create(dto) {
        const user = await this.prisma.user.create({
            data: {
                login: dto.login,
                password: dto.password,
                roles: ['user'],
                version: 1,
            },
        });
        return this.mapToDomain(user);
    }
    async update(id, data) {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: {
                    password: data.newPassword,
                    version: { increment: 1 },
                },
            });
            return this.mapToDomain(user);
        }
        catch {
            return undefined;
        }
    }
    async updateProfile(id, data) {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: {
                    ...(data.nickname !== undefined ? { nickname: data.nickname } : {}),
                    ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
                    version: { increment: 1 },
                },
            });
            return this.mapToDomain(user);
        }
        catch {
            return undefined;
        }
    }
    async delete(id) {
        try {
            await this.prisma.user.delete({ where: { id } });
            return true;
        }
        catch {
            return false;
        }
    }
    mapToDomain(user) {
        return {
            id: user.id,
            login: user.login,
            password: user.password,
            nickname: user.nickname,
            avatarUrl: user.avatarUrl,
            roles: user.roles || ['user'],
            version: user.version,
            createdAt: user.createdAt.getTime(),
            updatedAt: user.updatedAt.getTime(),
        };
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaUserRepository);
//# sourceMappingURL=prisma.user.repository.js.map