import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CharacterEngineModule } from '../character-engine/character-engine.module';
import { EnvironmentService } from './environments.service';
import { EnvironmentsGateway } from './environments.gateway';
import { EnvironmentController } from './environments.controller';
import { DatabaseModule } from '../database/database.module';
import { AiMessagesModule } from '../ai-messages/ai-messages.module';
import { EnvironmentConsumer } from './environments.consumer';

@Module({
  imports: [
    DatabaseModule,
    CharacterEngineModule,
    AiMessagesModule,
    BullModule.registerQueue({ name: 'environment' }),
  ],
  providers: [EnvironmentService, EnvironmentsGateway, EnvironmentConsumer],
  exports: [EnvironmentService],
  controllers: [EnvironmentController],
})
export class EnvironmentModule {}
