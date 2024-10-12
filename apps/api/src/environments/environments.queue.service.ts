import { Inject, Injectable } from '@nestjs/common';
import Queue, { type Queue as BullBoardQueue } from 'bull';
import { type BullBoardInstance, InjectBullBoard } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { environments } from '@2pm/data/schema';
import { eq } from 'drizzle-orm';
import DBService from '@2pm/db';
import { InferSelectModel } from 'drizzle-orm';
import { PlotPointDto } from '@2pm/data';

type Environment = InferSelectModel<typeof environments>;
type JobData = PlotPointDto;

type EnvironmentQueue = BullBoardQueue<JobData>;

@Injectable()
export class EnvironmentQueueService {
  private queues: Map<string, EnvironmentQueue> = new Map();

  constructor(
    @InjectBullBoard() private readonly board: BullBoardInstance,
    @Inject('DB') private readonly db: DBService,
  ) {}

  async init() {
    const res = await this.db.drizzle
      .select({ id: environments.id })
      .from(environments)
      .where(eq(environments.type, 'COMPANION_ONE_TO_ONE'));

    for (const { id } of res) {
      this.add(id);
    }
  }

  async add(environmentId: Environment['id']) {
    const queue = new Queue<JobData>(`env-${environmentId}`, {
      redis: { host: 'localhost', port: 6379 },
    });

    queue.process(1, this.process.bind(this));

    this.board.addQueue(new BullAdapter(queue));
    this.queues.set(`env-${environmentId}`, queue);
  }

  get(environmentId: Environment['id']) {
    const queue = this.queues.get(`env-${environmentId}`);
    if (!queue) {
      throw new Error();
    }
    return queue;
  }

  async handlePlotPointCreated(plotPoint: PlotPointDto) {
    const queue = this.get(plotPoint.data.environment.id);
    await queue.add(plotPoint);
  }

  async process(job: Queue.Job<JobData>) {
    if (job.data.type === 'HUMAN_MESSAGE') {
      console.log(
        `Processing job ${job.id} ${job.data.data.humanMessage.content}`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 4000));
    console.log(`Job ${job.id} completed`);
  }
}
