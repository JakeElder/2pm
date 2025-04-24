import { Module } from '@nestjs/common';
import { AiMessagesController } from './ai-messages.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AiMessagesController],
  providers: [],
})
export class AiMessagesModule {}
