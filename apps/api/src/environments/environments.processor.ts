import {
  EvaluatablePlotPointType,
  PlotPoint,
  AiUserMessagePlotPointDto,
  EVALUATABLE_PLOT_POINT_TYPES,
  EvaluationPlotPointDto,
  EvaluationPlotPointDtoSchema,
  AiUserMessagePlotPointDtoSchema,
  HumanUserMessagePlotPointDtoSchema,
  AuthEmailSentPlotPointDtoSchema,
  PlotPointDto,
} from '@2pm/core';
import { DBService } from '@2pm/core/db';
import { Processor, Process } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import Redis from 'ioredis';
import CharacterEngine from '@2pm/character-engine';
import { AppEventEmitter } from '../event-emitter';
import {
  aiUserMessages,
  aiUsers,
  environments,
  messages,
  plotPoints,
  users,
  humanUserMessages,
  humanUsers,
  evaluations,
  tools,
} from '@2pm/core/schema';
import { asc, eq, and, inArray, lte } from 'drizzle-orm';
import { ZodType } from 'zod';
import { logError } from '../utils';

@Processor('environments')
export class EnvironmentsProcessor {
  private readonly logger = new Logger(EnvironmentsProcessor.name);

  constructor(
    @Inject('DB') private readonly db: DBService,
    @Inject('CE') private readonly ce: CharacterEngine,
    @Inject('REDIS') private readonly redis: Redis,
    @Inject('E') private readonly events: AppEventEmitter,
  ) {}

  async getSummaries(plotPoint: PlotPoint) {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        humanUserMessage: humanUserMessages,
        aiUserMessage: aiUserMessages,
        user: users,
        humanUser: humanUsers,
        aiUser: aiUsers,
        environment: environments,
        tool: tools,
        evaluation: evaluations,
      })
      .from(plotPoints)
      .innerJoin(environments, eq(environments.id, plotPoints.environmentId))
      .innerJoin(users, eq(users.id, plotPoints.userId))
      .leftJoin(messages, eq(messages.plotPointId, plotPoints.id))
      .leftJoin(evaluations, eq(evaluations.plotPointId, plotPoints.id))
      .leftJoin(tools, eq(evaluations.toolId, tools.id))
      .leftJoin(humanUserMessages, eq(messages.id, humanUserMessages.messageId))
      .leftJoin(aiUserMessages, eq(messages.id, aiUserMessages.messageId))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId))
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .where(
        and(
          eq(plotPoints.environmentId, plotPoint.environmentId),
          inArray(plotPoints.type, EVALUATABLE_PLOT_POINT_TYPES as any),
          lte(plotPoints.createdAt, new Date(plotPoint.createdAt)),
        ),
      )
      .orderBy(asc(plotPoints.id));

    const schemas: Record<EvaluatablePlotPointType, ZodType<any>> = {
      EVALUATION: EvaluationPlotPointDtoSchema,
      AI_USER_MESSAGE: AiUserMessagePlotPointDtoSchema,
      HUMAN_USER_MESSAGE: HumanUserMessagePlotPointDtoSchema,
      AUTH_EMAIL_SENT: AuthEmailSentPlotPointDtoSchema,
    };

    const summaries = res.map((row) => {
      const Schema = schemas[row.plotPoint.type as EvaluatablePlotPointType];

      const summary = Schema.safeParse({
        type: row.plotPoint.type,
        data: row,
      });

      if (summary.error) {
        console.log(row.plotPoint.type);
        console.log(row);
        console.error(summary.error);
      }

      return summary.data as PlotPointDto;
    });

    return summaries;
  }

  @Process()
  async process(
    job: Job<{
      trigger: PlotPoint;
      evaluation: EvaluationPlotPointDto | null;
    }>,
  ) {
    try {
      const summaries = await this.getSummaries(job.data.trigger);
      const e = await this.ce.evaluate(summaries);

      const evaluationPlotPointDto = await this.db.plotPoints.insert({
        type: 'EVALUATION',
        triggerId: job.data.trigger.id,
        environmentId: job.data.trigger.environmentId,
        args: e.args,
        toolId: e.tool,
        userId: 1,
      });

      if (e.tool === 'REQUEST_EMAIL_ADDRESS') {
        const res = await this.ce.requestEmailAddress([
          ...summaries,
          EvaluationPlotPointDtoSchema.parse(evaluationPlotPointDto),
        ]);

        const aiUserMessagePlotPointDto = await this.streamMessage(
          job.data.trigger.environmentId,
          res,
        );

        return [evaluationPlotPointDto, aiUserMessagePlotPointDto];
      }

      if (e.tool === 'RESPOND_GENERAL') {
        const res = await this.ce.respondGeneral([
          ...summaries,
          EvaluationPlotPointDtoSchema.parse(evaluationPlotPointDto),
        ]);
        const aiUserMessagePlotPointDto = await this.streamMessage(
          job.data.trigger.environmentId,
          res,
        );

        return [evaluationPlotPointDto, aiUserMessagePlotPointDto];
      }

      this.logger.warn(`Missing implementation: ${e.tool}`);

      return [evaluationPlotPointDto];
    } catch (e) {
      logError(this.logger, e);
      this.logger.error(e);
      throw new Error();
    }
  }

  async streamMessage(
    environmentId: number,
    stream: any,
  ): Promise<AiUserMessagePlotPointDto> {
    let init = false;
    let content = '';
    let dto: AiUserMessagePlotPointDto | null = null;

    for await (const chunk of stream) {
      content += chunk;

      if (!init) {
        dto = await this.db.plotPoints.insert({
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
        const updated = await this.db.messages.update({
          type: 'AI_USER',
          id: dto.data.message.id,
          content,
        });
        this.events.emit('messages.updated', updated);
      }
    }

    if (dto) {
      return dto;
    }

    throw new Error();
  }
}
