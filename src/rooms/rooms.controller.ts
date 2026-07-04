import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { AuthUser } from '../auth/auth-user.interface';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import type { Room, RoomWithState } from './room.types';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly rooms: RoomsService) {}

  @Get()
  list(): Room[] {
    return this.rooms.list();
  }

  @Get(':id')
  get(@Param('id') id: string): RoomWithState {
    return this.rooms.getWithState(id);
  }

  @Post()
  @UseGuards(SupabaseAuthGuard)
  create(@Body() dto: CreateRoomDto, @CurrentUser() user: AuthUser): Room {
    return this.rooms.create(dto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(SupabaseAuthGuard)
  delete(@Param('id') id: string, @CurrentUser() user: AuthUser): void {
    this.rooms.delete(id, user);
  }
}
