import { Module } from '@nestjs/common';
import { EnvironmentService } from './environments.service';
import { EnvironmentGateway } from './environments.gateway';
import { EnvironmentController } from './environments.controller';
import { EnvironmentQueueService } from './environments.queue.service';
import { CharacterEngineModule } from '../character-engine/character-engine.module';
import { DatabaseModule } from '../database/database.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [DatabaseModule, CharacterEngineModule, MessagesModule],
  providers: [EnvironmentService, EnvironmentGateway, EnvironmentQueueService],
  exports: [EnvironmentService],
  controllers: [EnvironmentController],
})
export class EnvironmentModule {}
