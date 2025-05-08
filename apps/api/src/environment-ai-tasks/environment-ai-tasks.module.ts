import { Module } from '@nestjs/common';
import { EnvironmentAiTasksController } from './environment-ai-tasks.controller';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { EnvironmentAiTasksProcessor } from './environment-ai-tasks.processor';
import { DatabaseModule } from '../database/database.module';

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
  ],
  providers: [EnvironmentAiTasksProcessor],
  controllers: [EnvironmentAiTasksController],
})
export class EnvironmentAiTasksModule {}
