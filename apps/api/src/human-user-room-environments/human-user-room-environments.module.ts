import { Module } from '@nestjs/common';
import { HumanUserRoomEnvironmentsController } from './human-user-room-environments.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HumanUserRoomEnvironmentsController],
})
export class HumanUserRoomEnvironmentsModule {}
