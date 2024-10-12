import { Inject, Injectable } from '@nestjs/common';
import Queue, { type Queue as BullBoardQueue } from 'bull';
import { type BullBoardInstance, InjectBullBoard } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { environments } from '@2pm/data/schema';
import { eq } from 'drizzle-orm';
import DBService from '@2pm/db';
import { InferSelectModel } from 'drizzle-orm';
import { HydratedPlotPointDto } from '@2pm/data';

type Environment = InferSelectModel<typeof environments>;
type JobData = {
  trigger: HydratedPlotPointDto;
};

@Injectable()
export class EnvironmentQueueService {
  private queues: Map<string, BullBoardQueue> = new Map();

  constructor(
    @InjectBullBoard() private readonly board: BullBoardInstance,
    @Inject('DB') private readonly db: DBService,
  ) {}

  queueFor(environmentId: Environment['id']): BullBoardQueue<Environment> {
    const queue = new Queue(`environment-${environmentId}`, {
      redis: { host: 'localhost', port: 6379 },
    });

    queue.process(1, this.process);

    this.queues.set(`${environmentId}`, queue);
    this.board.addQueue(new BullAdapter(queue));

    return queue;
  }

  async process(job: Queue.Job<{ environment: Environment }>) {
    console.log(
      `Processing job for room: ${job.data.environment.id} with data:`,
      job.data,
    );
    job.log('doing stuff');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    job.moveToCompleted();
  }

  async createQueues() {
    const res = await this.db.drizzle
      .select()
      .from(environments)
      .where(eq(environments.type, 'COMPANION_ONE_TO_ONE'));

    for (const row of res) {
      this.queueFor(row);
    }
  }
}
