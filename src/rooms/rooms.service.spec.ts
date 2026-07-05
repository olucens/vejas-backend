import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RoomService } from './rooms.service';
import { IRoomRepository } from './rooms.repository.interface';
import { Room } from './entities/rooms.entity';

describe('RoomService', () => {
  let service: RoomService;
  let repository: jest.Mocked<IRoomRepository>;

  const mockRoom = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Room',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Room;

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        { provide: 'ROOM_REPOSITORY', useValue: mockRepository },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
    repository = module.get('ROOM_REPOSITORY');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all items', async () => {
      repository.findAll.mockResolvedValue([mockRoom]);
      const result = await service.findAll();
      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return item by id', async () => {
      repository.findById.mockResolvedValue(mockRoom);
      const result = await service.findOne((mockRoom as any).id);
      expect(result).toEqual(mockRoom);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findById.mockResolvedValue(undefined);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if not found', async () => {
      repository.delete.mockResolvedValue(false);
      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
