import { ConfigService } from '@nestjs/config';
import { AuthUser } from './auth-user.interface';
export declare class SupabaseJwtService {
    private readonly hsSecret?;
    private readonly jwks?;
    constructor(config: ConfigService);
    verify(token: string): Promise<AuthUser>;
}
