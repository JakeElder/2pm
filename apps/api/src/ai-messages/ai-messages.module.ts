import { Module } from '@nestjs/common';
import { AiMessagesController } from './ai-messages.controller';
import { DatabaseModule } from '../database/database.module';
import { AiMessagesGateway } from './ai-messages.gateway';

@Module({
  imports: [DatabaseModule],
  providers: [AiMessagesGateway],
  controllers: [AiMessagesController],
})
export class AiMessagesModule {}
