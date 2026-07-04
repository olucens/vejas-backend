import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @Length(3, 60)
  name: string;

  @IsString()
  @Length(0, 300)
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  coverUrl?: string;
}
