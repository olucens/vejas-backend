import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createRemoteJWKSet,
  jwtVerify,
  type JWTPayload,
  type JWTVerifyGetKey,
} from 'jose';
import { AuthUser } from './auth-user.interface';

interface SupabaseJwtPayload extends JWTPayload {
  email?: string;
  user_metadata?: { name?: string; full_name?: string; user_name?: string };
}

@Injectable()
export class SupabaseJwtService {
  private readonly hsSecret?: Uint8Array;
  private readonly jwks?: JWTVerifyGetKey;

  constructor(config: ConfigService) {
    const secret = config.get<string>('SUPABASE_JWT_SECRET');
    const supabaseUrl = config.get<string>('SUPABASE_URL');

    if (secret) {
      this.hsSecret = new TextEncoder().encode(secret);
    } else if (supabaseUrl) {
      this.jwks = createRemoteJWKSet(
        new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`),
      );
    }
  }

  async verify(token: string): Promise<AuthUser> {
    if (!this.hsSecret && !this.jwks) {
      throw new UnauthorizedException(
        'Auth is not configured: set SUPABASE_JWT_SECRET or SUPABASE_URL',
      );
    }

    try {
      const { payload } = this.hsSecret
        ? await jwtVerify<SupabaseJwtPayload>(token, this.hsSecret)
        : await jwtVerify<SupabaseJwtPayload>(token, this.jwks!);

      if (!payload.sub) {
        throw new Error('Token has no subject');
      }

      const meta = payload.user_metadata;
      return {
        id: payload.sub,
        email: payload.email,
        name: meta?.name ?? meta?.full_name ?? meta?.user_name ?? payload.email,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
