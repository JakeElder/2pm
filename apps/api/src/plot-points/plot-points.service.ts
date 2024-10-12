import {
  AiMessagePlotPointDto,
  CreatePlotPointDto,
  HumanMessagePlotPointDto,
  InferPlotPointDto,
  PlotPointDto,
} from '@2pm/data';
import {
  aiMessages,
  aiUsers,
  environments,
  humanMessages,
  humanUsers,
  messages,
  plotPointMessages,
  plotPoints,
  users,
} from '@2pm/data/schema';
import DBService from '@2pm/db';
import { Inject, Injectable } from '@nestjs/common';
import { desc, eq, and, inArray } from 'drizzle-orm';

@Injectable()
export class PlotPointsService {
  constructor(@Inject('DB') private readonly db: DBService) {}

  public async create<T extends CreatePlotPointDto>(
    dto: T,
  ): Promise<InferPlotPointDto<T>> {
    return this.db.plotPoints.insert(dto);
  }

  async findAllByEnvironmentId(id: number) {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        aiMessage: aiMessages,
        humanMessage: humanMessages,
        user: users,
        aiUser: aiUsers,
        humanUser: humanUsers,
        environment: environments,
      })
      .from(plotPoints)
      .leftJoin(
        plotPointMessages,
        eq(plotPoints.id, plotPointMessages.plotPointId),
      )
      .leftJoin(messages, eq(plotPointMessages.messageId, messages.id))
      .leftJoin(aiMessages, eq(messages.id, aiMessages.messageId))
      .leftJoin(humanMessages, eq(messages.id, humanMessages.messageId))
      .leftJoin(users, eq(messages.userId, users.id))
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .where(
        and(
          eq(plotPoints.environmentId, id),
          inArray(plotPoints.type, ['AI_MESSAGE', 'HUMAN_MESSAGE']),
        ),
      )
      .orderBy(desc(plotPoints.id));

    const data: PlotPointDto[] = res.map((row) => {
      if (row.plotPoint.type === 'HUMAN_MESSAGE') {
        const { user, humanUser, humanMessage, message, ...rest } = row;

        if (!user || !humanUser || !humanMessage || !message) {
          throw new Error();
        }

        const res: HumanMessagePlotPointDto = {
          type: 'HUMAN_MESSAGE',
          data: {
            type: 'HUMAN',
            ...rest,
            user,
            humanUser,
            message,
            humanMessage,
          },
        };

        return res;
      }

      if (row.plotPoint.type === 'AI_MESSAGE') {
        const { user, aiUser, aiMessage, message, ...rest } = row;

        if (!user || !aiUser || !aiMessage || !message) {
          throw new Error();
        }

        const res: AiMessagePlotPointDto = {
          type: 'AI_MESSAGE',
          data: {
            type: 'AI',
            ...rest,
            user,
            aiUser,
            message,
            aiMessage,
          },
        };

        return res;
      }

      throw new Error();
    });

    return data;
  }

  async findHumanMessages() {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        humanMessage: humanMessages,
        user: users,
        humanUser: humanUsers,
        environment: environments,
      })
      .from(plotPoints)
      .innerJoin(
        plotPointMessages,
        eq(plotPoints.id, plotPointMessages.plotPointId),
      )
      .innerJoin(messages, eq(plotPointMessages.messageId, messages.id))
      .innerJoin(humanMessages, eq(messages.id, humanMessages.messageId))
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(humanUsers, eq(users.id, humanUsers.userId))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .where(eq(plotPoints.type, 'HUMAN_MESSAGE'))
      .orderBy(desc(plotPoints.id));

    const data: HumanMessagePlotPointDto[] = res.map((row) => {
      const res: HumanMessagePlotPointDto = {
        type: 'HUMAN_MESSAGE',
        data: { type: 'HUMAN', ...row },
      };

      return res;
    });

    return data;
  }

  async findAiMessages() {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        aiMessage: aiMessages,
        user: users,
        aiUser: aiUsers,
        environment: environments,
      })
      .from(plotPoints)
      .innerJoin(
        plotPointMessages,
        eq(plotPoints.id, plotPointMessages.plotPointId),
      )
      .innerJoin(messages, eq(plotPointMessages.messageId, messages.id))
      .innerJoin(aiMessages, eq(messages.id, aiMessages.messageId))
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(aiUsers, eq(users.id, aiUsers.userId))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .where(eq(plotPoints.type, 'AI_MESSAGE'))
      .orderBy(desc(plotPoints.id));

    const data: AiMessagePlotPointDto[] = res.map((row) => {
      const res: AiMessagePlotPointDto = {
        type: 'AI_MESSAGE',
        data: { type: 'AI', ...row },
      };

      return res;
    });

    return data;
  }
}
