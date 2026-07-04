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
exports.SupabaseJwtService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jose_1 = require("jose");
let SupabaseJwtService = class SupabaseJwtService {
    hsSecret;
    jwks;
    constructor(config) {
        const secret = config.get('SUPABASE_JWT_SECRET');
        const supabaseUrl = config.get('SUPABASE_URL');
        if (secret) {
            this.hsSecret = new TextEncoder().encode(secret);
        }
        else if (supabaseUrl) {
            this.jwks = (0, jose_1.createRemoteJWKSet)(new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`));
        }
    }
    async verify(token) {
        if (!this.hsSecret && !this.jwks) {
            throw new common_1.UnauthorizedException('Auth is not configured: set SUPABASE_JWT_SECRET or SUPABASE_URL');
        }
        try {
            const { payload } = this.hsSecret
                ? await (0, jose_1.jwtVerify)(token, this.hsSecret)
                : await (0, jose_1.jwtVerify)(token, this.jwks);
            if (!payload.sub) {
                throw new Error('Token has no subject');
            }
            const meta = payload.user_metadata;
            return {
                id: payload.sub,
                email: payload.email,
                name: meta?.name ?? meta?.full_name ?? meta?.user_name ?? payload.email,
            };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
};
exports.SupabaseJwtService = SupabaseJwtService;
exports.SupabaseJwtService = SupabaseJwtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseJwtService);
//# sourceMappingURL=supabase-jwt.service.js.map