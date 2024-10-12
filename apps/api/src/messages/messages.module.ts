import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { DatabaseModule } from 'src/database/database.module';
import { EventEmitterModule } from 'src/event-emitter/event-emitter.module';
import { MessagesGateway } from './messages.gateway';

@Module({
  imports: [DatabaseModule, EventEmitterModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
  exports: [MessagesService],
})
export class MessagesModule {}
