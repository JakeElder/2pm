import {
  AiUserMessagePlotPointSummaryDtoSchema,
  AnonymousUserMessagePlotPointSummaryDtoSchema,
  AuthEmailSentPlotPointSummaryDtoSchema,
  AuthenticatedUserMessagePlotPointSummaryDtoSchema,
  EvaluatablePlotPointType,
  EvaluationPlotPointDto,
  EvaluationPlotPointSummaryDtoSchema,
  PlotPoint,
  PlotPointSummaryDto,
  EVALUATABLE_PLOT_POINT_TYPES,
  ChatStream,
  AiUserMessagePlotPointDto,
} from '@2pm/data';
import { Processor, Process } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import Redis from 'ioredis';
import CharacterEngine from '@2pm/character-engine';
import { MessagesService } from '../messages/messages.service';
import { PlotPointsService } from '../plot-points/plot-points.service';
import { AppEventEmitter } from '../event-emitter';
import {
  aiUserMessages,
  aiUsers,
  environments,
  authenticatedUserMessages,
  authenticatedUsers,
  messages,
  plotPointMessages,
  plotPoints,
  users,
  anonymousUserMessages,
  anonymousUsers,
} from '@2pm/data/schema';
import DBService from '@2pm/db';
import { asc, eq, and, inArray, lte } from 'drizzle-orm';
import { ZodType } from 'zod';

@Processor('environments')
export class EnvironmentsProcessor {
  private readonly logger = new Logger(EnvironmentsProcessor.name);

  constructor(
    @Inject('DB') private readonly db: DBService,
    @Inject('CE') private readonly ce: CharacterEngine,
    @Inject('REDIS') private readonly redis: Redis,
    @Inject('E') private readonly events: AppEventEmitter,
    private readonly plotPointsService: PlotPointsService,
    private readonly messageService: MessagesService,
  ) {}

  async getSummaries(plotPoint: PlotPoint) {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        anonymousUserMessage: anonymousUserMessages,
        aiUserMessage: aiUserMessages,
        authenticatedUserMessage: authenticatedUserMessages,
        user: users,
        anonymousUser: anonymousUsers,
        authenticatedUser: authenticatedUsers,
        aiUser: aiUsers,
        environment: environments,
      })
      .from(plotPoints)
      .leftJoin(
        plotPointMessages,
        eq(plotPoints.id, plotPointMessages.plotPointId),
      )
      .leftJoin(messages, eq(plotPointMessages.messageId, messages.id))
      .leftJoin(
        anonymousUserMessages,
        eq(messages.id, anonymousUserMessages.messageId),
      )
      .leftJoin(
        authenticatedUserMessages,
        eq(messages.id, authenticatedUserMessages.messageId),
      )
      .leftJoin(aiUserMessages, eq(messages.id, aiUserMessages.messageId))
      .leftJoin(users, eq(messages.userId, users.id))
      .leftJoin(anonymousUsers, eq(users.id, anonymousUsers.userId))
      .leftJoin(authenticatedUsers, eq(users.id, authenticatedUsers.userId))
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .where(
        and(
          eq(plotPoints.environmentId, plotPoint.environmentId),
          inArray(plotPoints.type, EVALUATABLE_PLOT_POINT_TYPES as any),
          lte(plotPoints.createdAt, new Date(plotPoint.createdAt)),
        ),
      )
      .orderBy(asc(plotPoints.id));

    const schemas: Record<EvaluatablePlotPointType, ZodType<any>> = {
      EVALUATION: EvaluationPlotPointSummaryDtoSchema,
      AI_USER_MESSAGE: AiUserMessagePlotPointSummaryDtoSchema,
      AUTHENTICATED_USER_MESSAGE:
        AuthenticatedUserMessagePlotPointSummaryDtoSchema,
      ANONYMOUS_USER_MESSAGE: AnonymousUserMessagePlotPointSummaryDtoSchema,
      AUTH_EMAIL_SENT: AuthEmailSentPlotPointSummaryDtoSchema,
    };

    const summaries = res.map((row) => {
      const Schema = schemas[row.plotPoint.type as EvaluatablePlotPointType];

      const summary = Schema.safeParse({
        type: row.plotPoint.type,
        data: row,
      });

      if (summary.error) {
        console.log(row.plotPoint.type);
        console.error(summary.error);
      }

      return summary.data as PlotPointSummaryDto;
    });

    return summaries;
  }

  @Process()
  async process(
    job: Job<{ trigger: PlotPoint }>,
  ): Promise<EvaluationPlotPointDto> {
    const summaries = await this.getSummaries(job.data.trigger);

    const e = await this.ce.evaluate(summaries);

    // this.db.plotPoints.insert({
    //   type: 'EVALUATION',
    //   environmentId: job.data.trigger.environmentId,
    //   args: e.args,
    //   toolId: e.tool,
    //   userId: 1
    // })

    console.log(e.tool);

    if (e.tool === 'REQUEST_EMAIL_ADDRESS') {
      const res = await this.ce.requestEmailAddress([...summaries]);
      await this.streamMessage(job.data.trigger.environmentId, res);
    }

    return {
      type: 'EVALUATION',
    } as any;
  }

  async streamMessage(environmentId: number, stream: ChatStream) {
    let init = false;
    let content = '';
    let dto: AiUserMessagePlotPointDto | null = null;

    for await (const chunk of stream) {
      content += chunk;

      if (!init) {
        dto = await this.plotPointsService.create({
          type: 'AI_USER_MESSAGE',
          environmentId,
          content,
          userId: 2,
          state: 'OUTPUTTING',
        });
        this.events.emit('plot-points.created', dto);
        init = true;
      }

      if (dto) {
        const updated = await this.messageService.update({
          type: 'AI_USER',
          id: dto.data.message.id,
          content,
        });
        this.events.emit('messages.updated', updated);
      }
    }

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
