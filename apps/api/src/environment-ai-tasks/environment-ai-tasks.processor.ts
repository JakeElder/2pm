import { eq } from 'drizzle-orm';
import { PlotPointDto } from '@2pm/core';
import { type DBService } from '@2pm/core/db';
import { Processor, Process } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { AppEventEmitter } from '../event-emitter';
import { aiUsers, environments } from '@2pm/core/schema';

@Processor('environment-ai-tasks')
export class EnvironmentAiTasksProcessor {
  constructor(
    @Inject('DB') private readonly db: DBService,
    @Inject('E') private readonly events: AppEventEmitter,
  ) {}

  @Process()
  async process(job: Job<{ trigger: PlotPointDto }>) {
    const [environment] = await this.db.core.drizzle
      .select()
      .from(environments)
      .where(eq(environments.id, job.data.trigger.data.environment.id));

    const [aiUser] = await this.db.core.drizzle
      .select()
      .from(aiUsers)
      .where(eq(aiUsers.id, 'NIKO'));

    this.events.emit('environment-ai-tasks.updated', {
      aiUser,
      createdAt: new Date(),
      environmentId: environment.id,
      id: 1,
      state: 'THINKING',
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.events.emit('environment-ai-tasks.updated', {
      aiUser,
      createdAt: new Date(),
      environmentId: environment.id,
      id: 1,
      state: 'ACTING',
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.events.emit('environment-ai-tasks.updated', {
      aiUser,
      createdAt: new Date(),
      environmentId: environment.id,
      id: 1,
      state: 'RESPONDING',
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.events.emit('environment-ai-tasks.completed', {
      environmentId: environment.id,
    });
  }
}
