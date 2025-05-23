import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { EnvironmentAiTasksController } from './environment-ai-tasks.controller';
import { EnvironmentAiTasksProcessor } from './environment-ai-tasks.processor';
import { EnvironmentAiTasksGateway } from './environment-ai-tasks.gateway';
import { DatabaseModule } from '../database/database.module';

import { IrisModule } from '../iris/iris.module';
import { NikoModule } from '../niko/niko.module';
import { NoteModule } from '../note/note.module';
import { TagModule } from '../tag/tag.module';
import { TinyModule } from '../tiny/tiny.module';
import { WhyModule } from '../why/why.module';

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

    IrisModule,
    NikoModule,
    NoteModule,
    TagModule,
    TinyModule,
    WhyModule,
  ],
  providers: [EnvironmentAiTasksProcessor, EnvironmentAiTasksGateway],
  controllers: [EnvironmentAiTasksController],
})
export class EnvironmentAiTasksModule {}
