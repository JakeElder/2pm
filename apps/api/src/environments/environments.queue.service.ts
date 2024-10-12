import { Inject, Injectable, Logger } from '@nestjs/common';
import Queue, { type Queue as BullBoardQueue } from 'bull';
import { type BullBoardInstance, InjectBullBoard } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { environments } from '@2pm/data/schema';
import { eq } from 'drizzle-orm';
import DBService from '@2pm/db';
import { InferSelectModel } from 'drizzle-orm';
import { PlotPointDto } from '@2pm/data';
import CharacterEngine from '@2pm/character-engine';
import Redis from 'ioredis';
import { PlotPointsService } from '../plot-points/plot-points.service';
import { AppEventEmitter } from '../event-emitter';
import { MessagesService } from '../messages/messages.service';

type Environment = InferSelectModel<typeof environments>;
type JobData = {
  trigger: PlotPointDto;
};

type EnvironmentQueue = BullBoardQueue<JobData>;

@Injectable()
export class EnvironmentQueueService {
  private readonly logger = new Logger(EnvironmentQueueService.name);
  private queues: Map<string, EnvironmentQueue> = new Map();

  constructor(
    @InjectBullBoard() private readonly board: BullBoardInstance,
    @Inject('DB') private readonly db: DBService,
    @Inject('E') private readonly events: AppEventEmitter,
    @Inject('CE') private readonly ce: CharacterEngine,
    @Inject('REDIS') private readonly redis: Redis,
    private readonly plotPointsService: PlotPointsService,
    private readonly messageService: MessagesService,
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

  async handlePlotPointCreated(plotPoint: PlotPointDto) {
    const queue = this.get(plotPoint.data.environment.id);

    const [active] = await queue.getActive();
    const [waiting] = await queue.getWaiting();

    if (waiting) {
      this.logger.debug(`updating: ${plotPoint.type}`);
      await this.redis.set(`job:${active.id}:cancelled`, 'true');
      await waiting.update({ ...waiting.data, trigger: plotPoint });
      return;
    }

    this.logger.debug(`adding: ${plotPoint.type}`);
    await queue.add({ trigger: plotPoint });
  }

  async add(environmentId: Environment['id']) {
    const queue = new Queue<JobData>(`env-${environmentId}`, {
      redis: { host: 'localhost', port: 6379 },
    });

    await queue.obliterate({ force: true });

    queue.process(1, async (job) => {
      let message: string | null = null;

      const { type, data } = job.data.trigger;

      if (type === 'HUMAN_MESSAGE' || type === 'AI_MESSAGE') {
        message =
          type === 'HUMAN_MESSAGE'
            ? data.humanMessage.content
            : data.aiMessage.content;
      }

      this.logger.debug(`starting job:${job.id} - ${message}`);

      let content = '';
      let cancelled = false;

      const dto = await this.plotPointsService.create({
        type: 'AI_MESSAGE',
        environmentId: data.environment.id,
        content,
        userId: 2,
        state: 'OUTPUTTING',
      });
      this.events.emit('plot-points.created', dto);

      const res = this.ce.greet();

      for await (const chunk of res) {
        cancelled = !!(await this.redis.get(`job:${job.id}:cancelled`));

        if (cancelled) {
          break;
        }

        content += chunk;

        const updated = await this.messageService.update({
          type: 'AI',
          id: dto.data.message.id,
          content,
        });

        this.events.emit('messages.updated', updated);
      }

      if (cancelled) {
        this.logger.debug(`cancelled job:${job.id} - ${message}`);
        return true;
      }

      this.logger.debug(`finished job:${job.id} - ${message}`);
      return true;
    });

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
}
