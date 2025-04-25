import { Module } from '@nestjs/common';
import { WorldRoomEnvironmentsController } from './world-room-environments.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WorldRoomEnvironmentsController],
})
export class WorldRoomEnvironmentsModule {}
