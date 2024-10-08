import { Module } from '@nestjs/common';
import { AiMessagesService } from './ai-messages.service';
import { AiMessagesController } from './ai-messages.controller';
import { DatabaseModule } from '../database/database.module';
import { AiMessagesGateway } from './ai-messages.gateway';

@Module({
  imports: [DatabaseModule],
  controllers: [AiMessagesController],
  providers: [AiMessagesService, AiMessagesGateway],
  exports: [AiMessagesService],
})
export class AiMessagesModule {}
