import { Module } from '@nestjs/common';
import { RoomController } from './rooms.controller';
import { RoomService } from './rooms.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaRoomRepository } from './rooms.repository';

@Module({
  imports: [PrismaModule],
  controllers: [RoomController],
  providers: [
    {
      provide: 'ROOM_REPOSITORY',
      useClass: PrismaRoomRepository,
    },
    RoomService,
  ],
  exports: [RoomService],
})
export class RoomModule {}
