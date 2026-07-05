import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsNotEmpty()
  @IsString()
  adminId: string;

  @IsOptional()
  @IsDateString()
  createdAt?: Date;
}
