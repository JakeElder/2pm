import { Module } from '@nestjs/common';
import { CharacterEngineModule } from '../character-engine/character-engine.module';
import { EnvironmentService } from './environments.service';
import { EnvironmentsGateway } from './environments.gateway';
import { EnvironmentController } from './environments.controller';
import { DatabaseModule } from '../database/database.module';
import { AiMessagesModule } from '../ai-messages/ai-messages.module';

@Module({
  imports: [DatabaseModule, CharacterEngineModule, AiMessagesModule],
  providers: [EnvironmentService, EnvironmentsGateway],
  exports: [EnvironmentService],
  controllers: [EnvironmentController],
})
export class EnvironmentModule {}
