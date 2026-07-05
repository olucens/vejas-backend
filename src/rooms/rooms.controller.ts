import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoomService } from './rooms.service';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateRoomDto } from './dto/update-rooms.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomsService: RoomService) {}

  @Get()
  async findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ) {
    return this.roomsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateRoomDto,
  ) {
    return this.roomsService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
  ) {
    return this.roomsService.remove(id);
  }
}
