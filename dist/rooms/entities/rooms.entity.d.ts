export interface Room {
    id: string;
    name: string;
    description?: string;
    coverUrl?: string;
    adminId: string;
    createdAt?: Date;
}
