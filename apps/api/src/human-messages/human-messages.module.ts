import { Module } from '@nestjs/common';
import { HumanMessagesController } from './human-messages.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HumanMessagesController],
})
export class HumanMessagesModule {}
