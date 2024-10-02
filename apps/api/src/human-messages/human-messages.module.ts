import { Module } from '@nestjs/common';
import { HumanMessagesService } from './human-messages.service';
import { HumanMessagesController } from './human-messages.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HumanMessagesController],
  providers: [HumanMessagesService],
})
export class HumanMessagesModule {}
