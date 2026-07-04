import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthUser } from './auth-user.interface';
import { SupabaseJwtService } from './supabase-jwt.service';

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly jwt: SupabaseJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    request.user = await this.jwt.verify(header.slice('Bearer '.length));
    return true;
  }
}
