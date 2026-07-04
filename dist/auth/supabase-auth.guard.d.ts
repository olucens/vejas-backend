import { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { AuthUser } from './auth-user.interface';
import { SupabaseJwtService } from './supabase-jwt.service';
export interface AuthenticatedRequest extends Request {
    user: AuthUser;
}
export declare class SupabaseAuthGuard implements CanActivate {
    private readonly jwt;
    constructor(jwt: SupabaseJwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
