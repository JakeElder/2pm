import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CharacterEngineModule } from '../character-engine/character-engine.module';
import { EnvironmentService } from './environments.service';
import { EnvironmentsGateway } from './environments.gateway';
import { EnvironmentController } from './environments.controller';
import { DatabaseModule } from '../database/database.module';
import { EnvironmentConsumer } from './environments.consumer';
import { MessagesModule } from '../messages/messages.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Module({
  imports: [
    DatabaseModule,
    CharacterEngineModule,
    MessagesModule,
    BullModule.registerQueue({ name: 'environment' }),
    BullBoardModule.forFeature({
      name: 'environment',
      adapter: BullAdapter,
    }),
  ],
  providers: [EnvironmentService, EnvironmentsGateway, EnvironmentConsumer],
  exports: [EnvironmentService],
  controllers: [EnvironmentController],
})
export class EnvironmentModule {}
