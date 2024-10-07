import { Module } from '@nestjs/common';
import { AiMessagesService } from './ai-messages.service';
import { AiMessagesController } from './ai-messages.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AiMessagesController],
  providers: [AiMessagesService],
  exports: [AiMessagesService],
})
export class AiMessagesModule {}
