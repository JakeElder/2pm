import {
  AiUserMessagePlotPointDto,
  CreatePlotPointDto,
  InferPlotPointDto,
  PlotPointDto,
  HumanUserMessagePlotPointDto,
} from '@2pm/data';
import {
  aiUserMessages,
  aiUsers,
  environments,
  messages,
  plotPoints,
  users,
  humanUserMessages,
  humanUsers,
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
        humanUserMessage: humanUserMessages,
        aiUserMessage: aiUserMessages,
        user: users,
        humanUser: humanUsers,
        aiUser: aiUsers,
        environment: environments,
      })
      .from(plotPoints)
      .leftJoin(messages, eq(messages.plotPointId, plotPoints.id))
      .leftJoin(humanUserMessages, eq(messages.id, humanUserMessages.messageId))
      .leftJoin(aiUserMessages, eq(messages.id, aiUserMessages.messageId))
      .leftJoin(users, eq(messages.userId, users.id))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId))
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .where(
        and(
          eq(plotPoints.environmentId, id),
          inArray(plotPoints.type, ['AI_USER_MESSAGE', 'HUMAN_USER_MESSAGE']),
        ),
      )
      .orderBy(desc(plotPoints.id));

    const data: PlotPointDto[] = res.map((row) => {
      if (row.plotPoint.type === 'HUMAN_USER_MESSAGE') {
        const { user, humanUser, humanUserMessage, message, ...rest } = row;

        if (!user || !humanUser || !humanUserMessage || !message) {
          throw new Error();
        }

        const res: HumanUserMessagePlotPointDto = {
          type: 'HUMAN_USER_MESSAGE',
          data: {
            type: 'HUMAN_USER',
            ...rest,
            user,
            humanUser,
            message,
            humanUserMessage,
          },
        };

        return res;
      }

      if (row.plotPoint.type === 'AI_USER_MESSAGE') {
        const { user, aiUser, aiUserMessage, message, ...rest } = row;

        if (!user || !aiUser || !aiUserMessage || !message) {
          throw new Error();
        }

        const res: AiUserMessagePlotPointDto = {
          type: 'AI_USER_MESSAGE',
          data: {
            type: 'AI_USER',
            ...rest,
            user,
            aiUser,
            message,
            aiUserMessage,
          },
        };

        return res;
      }

      throw new Error();
    });

    return data;
  }

  async findHumanUserMessages() {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        humanUserMessage: humanUserMessages,
        user: users,
        humanUser: humanUsers,
        environment: environments,
      })
      .from(plotPoints)
      .innerJoin(messages, eq(messages.plotPointId, plotPoints.id))
      .innerJoin(
        humanUserMessages,
        eq(messages.id, humanUserMessages.messageId),
      )
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(humanUsers, eq(users.id, humanUsers.userId))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .where(eq(plotPoints.type, 'HUMAN_USER_MESSAGE'))
      .orderBy(desc(plotPoints.id));

    const data: HumanUserMessagePlotPointDto[] = res.map((row) => {
      const res: HumanUserMessagePlotPointDto = {
        type: 'HUMAN_USER_MESSAGE',
        data: { type: 'HUMAN_USER', ...row },
      };

      return res;
    });

    return data;
  }

  async findAiUserMessages() {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        aiUserMessage: aiUserMessages,
        user: users,
        aiUser: aiUsers,
        environment: environments,
      })
      .from(plotPoints)
      .innerJoin(messages, eq(messages.plotPointId, plotPoints.id))
      .innerJoin(aiUserMessages, eq(messages.id, aiUserMessages.messageId))
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(aiUsers, eq(users.id, aiUsers.userId))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .where(eq(plotPoints.type, 'AI_USER_MESSAGE'))
      .orderBy(desc(plotPoints.id));

    const data: AiUserMessagePlotPointDto[] = res.map((row) => {
      const res: AiUserMessagePlotPointDto = {
        type: 'AI_USER_MESSAGE',
        data: { type: 'AI_USER', ...row },
      };

      return res;
    });

    return data;
  }
}
