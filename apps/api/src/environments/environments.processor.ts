import { PlotPoint } from '@2pm/data';
import { Processor, Process } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import Redis from 'ioredis';
import CharacterEngine from '@2pm/character-engine';
import { MessagesService } from '../messages/messages.service';
import { PlotPointsService } from '../plot-points/plot-points.service';
import { AppEventEmitter } from '../event-emitter';

@Processor('environments')
export class EnvironmentsProcessor {
  private readonly logger = new Logger(EnvironmentsProcessor.name);

  constructor(
    @Inject('CE') private readonly ce: CharacterEngine,
    @Inject('REDIS') private readonly redis: Redis,
    @Inject('E') private readonly events: AppEventEmitter,
    private readonly plotPointsService: PlotPointsService,
    private readonly messageService: MessagesService,
  ) {}

  @Process()
  async process(job: Job<{ trigger: PlotPoint }>) {
    this.logger.log(job.data.trigger.createdAt);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return true;
  }

  // async p(job: Job<{ trigger: PlotPointDto }>) {
  //   let message: string | null = null;
  //
  //   const { type, data } = job.data.trigger;
  //
  //   if (type === 'AUTHENTICATED_USER_MESSAGE' || type === 'AI_USER_MESSAGE') {
  //     message =
  //       type === 'AUTHENTICATED_USER_MESSAGE'
  //         ? data.authenticatedUserMessage.content
  //         : data.aiUserMessage.content;
  //   }
  //
  //   this.logger.debug(`starting job:${job.id} - ${message}`);
  //
  //   let content = '';
  //   let cancelled = false;
  //
  //   const dto = await this.plotPointsService.create({
  //     type: 'AI_USER_MESSAGE',
  //     environmentId: data.environment.id,
  //     content,
  //     userId: 2,
  //     state: 'OUTPUTTING',
  //   });
  //   this.events.emit('plot-points.created', dto);
  //
  //   const res = this.ce.greet();
  //
  //   for await (const chunk of res) {
  //     cancelled = !!(await this.redis.get(`job:${job.id}:cancelled`));
  //
  //     if (cancelled) {
  //       break;
  //     }
  //
  //     content += chunk;
  //
  //     const updated = await this.messageService.update({
  //       type: 'AI_USER',
  //       id: dto.data.message.id,
  //       content,
  //     });
  //
  //     this.events.emit('messages.updated', updated);
  //   }
  //
  //   if (cancelled) {
  //     this.logger.debug(`cancelled job:${job.id} - ${message}`);
  //     return true;
  //   }
  //
  //   this.logger.debug(`finished job:${job.id} - ${message}`);
  //   return true;
  // }
}
