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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const hashPassword_1 = require("../crypto/hashPassword");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async signup(createUserDto) {
        try {
            return await this.userService.create(createUserDto);
        }
        catch (error) {
            if (error?.code === 'P2002') {
                throw new common_1.ConflictException('Login already exists');
            }
            throw error;
        }
    }
    async login(dto) {
        const user = await this.userService.getByLogin(dto.login);
        if (!user || !(await (0, hashPassword_1.comparePassword)(dto.password, user.password))) {
            throw new common_1.ForbiddenException('Incorrect login or password');
        }
        const roles = user.roles || ['user'];
        return this.generateTokens(user.id, user.login, roles);
    }
    async generateTokens(userId, login, roles = ['user']) {
        const payload = { userId, login, roles };
        const secret = process.env.JWT_SECRET_KEY;
        const refreshSecret = process.env.JWT_SECRET_REFRESH_KEY;
        if (!secret || !refreshSecret) {
            throw new Error('JWT_SECRET_KEY and JWT_SECRET_REFRESH_KEY must be set');
        }
        const accessExpiry = process.env.TOKEN_EXPIRE_TIME || '1h';
        const refreshExpiry = process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h';
        const accessToken = await this.jwtService.signAsync(payload, {
            secret,
            expiresIn: accessExpiry,
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: refreshSecret,
            expiresIn: refreshExpiry,
        });
        return { accessToken, refreshToken };
    }
    async refresh(dto) {
        if (!dto.refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token is missing');
        }
        const refreshSecret = process.env.JWT_SECRET_REFRESH_KEY;
        if (!refreshSecret) {
            throw new Error('JWT_SECRET_REFRESH_KEY must be set');
        }
        try {
            const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
                secret: refreshSecret,
            });
            const user = await this.userService.getByLogin(payload.login);
            if (!user) {
                throw new common_1.ForbiddenException('User not found');
            }
            const roles = user.roles || ['user'];
            return this.generateTokens(user.id, user.login, roles);
        }
        catch (e) {
            if (e instanceof common_1.ForbiddenException)
                throw e;
            throw new common_1.ForbiddenException('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map