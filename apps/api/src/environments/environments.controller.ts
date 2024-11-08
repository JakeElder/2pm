import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Job, type Queue } from 'bull';
import { PlotPoint, PlotPointDto, PlotPointType } from '@2pm/data';
import Redis from 'ioredis';
import { AppEventEmitter } from '../event-emitter';
import { EnvironmentGateway } from './environments.gateway';
import DBService from '@2pm/db';
import { environments, evaluations, plotPoints } from '@2pm/data/schema';
import { gt, desc, eq } from 'drizzle-orm';

@Controller()
export class EnvironmentsController implements OnModuleInit {
  private readonly logger = new Logger(EnvironmentsController.name);

  constructor(
    @Inject('E') private readonly events: AppEventEmitter,
    @Inject('REDIS') private readonly redis: Redis,
    @InjectQueue('environments')
    private readonly queue: Queue<{ trigger: PlotPoint }>,
    @Inject('DB') private readonly db: DBService,
    private readonly gateway: EnvironmentGateway,
  ) {}

  async onModuleInit() {
    const envs = await this.db.drizzle.select().from(environments);
    await Promise.all(envs.map((env) => this.redis.del(`env:${env.id}:job`)));

    this.events.on('plot-points.created', (e) => {
      this.handlePlotPointCreated(e);
    });

    this.queue.on('error', (error) => {
      this.logger.error(error);
    });

    this.queue.on('completed', (job) => {
      // console.log(job.returnvalue);
      this.handleJobCompleted(job);
    });

    this.events.on('environments.joined', (e) => {});
  }

  async handlePlotPointCreated(dto: PlotPointDto) {
    this.gateway.sendPlotPointCreatedEvent(dto);

    const triggers: PlotPointType[] = ['HUMAN_USER_MESSAGE'];

    if (!triggers.includes(dto.type)) {
      return;
    }

    const existing = await this.redis.get(`env:${dto.data.environment.id}:job`);

    if (!existing) {
      const job = await this.queue.add({ trigger: dto.data.plotPoint });
      this.redis.set(`env:${dto.data.environment.id}:job`, job.id);
    }
  }

  async handleJobCompleted(job: Job<{ trigger: PlotPoint }>) {
    const { trigger } = job.data;

    this.logger.log('Completed', job.data.trigger.id);
    await this.redis.del(`env:${job.data.trigger.environmentId}:job`);

    const [{ nextTrigger, evaluation }] = await this.db.drizzle
      .select({
        nextTrigger: plotPoints,
        evaluation: evaluations,
      })
      .from(plotPoints)
      .leftJoin(evaluations, eq(evaluations.plotPointId, plotPoints.id))
      .where(gt(plotPoints.createdAt, new Date(trigger.createdAt)))
      .orderBy(desc(plotPoints.createdAt))
      .limit(1);

    if (nextTrigger) {
      if (nextTrigger.type === 'EVALUATION' && evaluation?.toolId === 'NOOP') {
        return;
      }
      const job = await this.queue.add({ trigger: nextTrigger });
      this.redis.set(`env:${trigger.environmentId}:job`, job.id);
    }
  }
}
