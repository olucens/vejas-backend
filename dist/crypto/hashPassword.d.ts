export declare function hashPassword(pass: string): Promise<string>;
export declare function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
