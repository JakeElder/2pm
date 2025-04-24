import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { DatabaseModule } from '../database/database.module';
import { EventEmitterModule } from '../event-emitter/event-emitter.module';
import { MessagesGateway } from './messages.gateway';
import { AiUserMessagesController } from './ai-user-messages.controller';

@Module({
  imports: [DatabaseModule, EventEmitterModule],
  controllers: [MessagesController, AiUserMessagesController],
  providers: [MessagesGateway],
  exports: [],
})
export class MessagesModule {}
