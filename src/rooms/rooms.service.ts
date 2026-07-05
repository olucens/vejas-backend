import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IRoomRepository } from './rooms.repository.interface';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateRoomDto } from './dto/update-rooms.dto';

@Injectable()
export class RoomService {
  constructor(
    @Inject('ROOM_REPOSITORY')
    private repository: IRoomRepository,
  ) {}

  async findAll(parentId?: string) {
    return this.repository.findAll(parentId);
  }

  async findOne(id: string) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return item;
  }

  async create(createRoomDto: CreateRoomDto, parentId?: string) {
    return this.repository.create(createRoomDto, parentId);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const item = await this.repository.update(id, updateRoomDto);
    if (!item) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return item;
  }

  async remove(id: string) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
  }
}
