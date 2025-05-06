import { PlotPointDto } from '@2pm/core';
import { type DBService } from '@2pm/core/db';
import { Processor, Process } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { AppEventEmitter } from '../event-emitter';

@Processor('environments')
export class EnvironmentsProcessor {
  constructor(
    @Inject('DB') private readonly db: DBService,
    @Inject('E') private readonly events: AppEventEmitter,
  ) {}

  @Process()
  async process(job: Job<{ trigger: PlotPointDto }>) {
    console.log('process', job.data);
    await new Promise((resolve) => setTimeout(resolve, 4000));
    await job.moveToCompleted();
  }
}
