import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { EnvironmentAiTasksController } from './environment-ai-tasks.controller';
import { EnvironmentAiTasksProcessor } from './environment-ai-tasks.processor';
import { EnvironmentAiTasksGateway } from './environment-ai-tasks.gateway';
import { DatabaseModule } from '../database/database.module';
import { NikoModule } from '../niko/niko.module';

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: 'environment-ai-tasks',
    }),
    BullBoardModule.forFeature({
      name: 'environment-ai-tasks',
      adapter: BullAdapter,
    }),
    NikoModule,
  ],
  providers: [EnvironmentAiTasksProcessor, EnvironmentAiTasksGateway],
  controllers: [EnvironmentAiTasksController],
})
export class EnvironmentAiTasksModule {}
