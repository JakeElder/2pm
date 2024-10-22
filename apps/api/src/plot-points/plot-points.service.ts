import {
  AiUserMessagePlotPointDto,
  CreatePlotPointDto,
  AuthenticatedUserMessagePlotPointDto,
  InferPlotPointDto,
  PlotPointDto,
  AnonymousUserMessagePlotPointDto,
} from '@2pm/data';
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
          eq(plotPoints.environmentId, id),
          inArray(plotPoints.type, [
            'ANONYMOUS_USER_MESSAGE',
            'AUTHENTICATED_USER_MESSAGE',
            'AI_USER_MESSAGE',
          ]),
        ),
      )
      .orderBy(desc(plotPoints.id));

    const data: PlotPointDto[] = res.map((row) => {
      if (row.plotPoint.type === 'ANONYMOUS_USER_MESSAGE') {
        const { user, anonymousUser, anonymousUserMessage, message, ...rest } =
          row;

        if (!user || !anonymousUser || !anonymousUserMessage || !message) {
          throw new Error();
        }

        const res: AnonymousUserMessagePlotPointDto = {
          type: 'ANONYMOUS_USER_MESSAGE',
          data: {
            type: 'ANONYMOUS_USER',
            ...rest,
            user,
            anonymousUser,
            message,
            anonymousUserMessage,
          },
        };

        return res;
      }
      if (row.plotPoint.type === 'AUTHENTICATED_USER_MESSAGE') {
        const {
          user,
          authenticatedUser,
          authenticatedUserMessage,
          message,
          ...rest
        } = row;

        if (
          !user ||
          !authenticatedUser ||
          !authenticatedUserMessage ||
          !message
        ) {
          throw new Error();
        }

        const res: AuthenticatedUserMessagePlotPointDto = {
          type: 'AUTHENTICATED_USER_MESSAGE',
          data: {
            type: 'AUTHENTICATED_USER',
            ...rest,
            user,
            authenticatedUser,
            message,
            authenticatedUserMessage,
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

  async findAnonymousUserMessages() {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        anonymousUserMessage: anonymousUserMessages,
        user: users,
        anonymousUser: anonymousUsers,
        environment: environments,
      })
      .from(plotPoints)
      .innerJoin(
        plotPointMessages,
        eq(plotPoints.id, plotPointMessages.plotPointId),
      )
      .innerJoin(messages, eq(plotPointMessages.messageId, messages.id))
      .innerJoin(
        anonymousUserMessages,
        eq(messages.id, anonymousUserMessages.messageId),
      )
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(anonymousUsers, eq(users.id, anonymousUsers.userId))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .where(eq(plotPoints.type, 'ANONYMOUS_USER_MESSAGE'))
      .orderBy(desc(plotPoints.id));

    const data: AnonymousUserMessagePlotPointDto[] = res.map((row) => {
      const res: AnonymousUserMessagePlotPointDto = {
        type: 'ANONYMOUS_USER_MESSAGE',
        data: { type: 'ANONYMOUS_USER', ...row },
      };

      return res;
    });

    return data;
  }

  async findAuthenticatedUserMessages() {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        authenticatedUserMessage: authenticatedUserMessages,
        user: users,
        authenticatedUser: authenticatedUsers,
        environment: environments,
      })
      .from(plotPoints)
      .innerJoin(
        plotPointMessages,
        eq(plotPoints.id, plotPointMessages.plotPointId),
      )
      .innerJoin(messages, eq(plotPointMessages.messageId, messages.id))
      .innerJoin(
        authenticatedUserMessages,
        eq(messages.id, authenticatedUserMessages.messageId),
      )
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(authenticatedUsers, eq(users.id, authenticatedUsers.userId))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .where(eq(plotPoints.type, 'AUTHENTICATED_USER_MESSAGE'))
      .orderBy(desc(plotPoints.id));

    const data: AuthenticatedUserMessagePlotPointDto[] = res.map((row) => {
      const res: AuthenticatedUserMessagePlotPointDto = {
        type: 'AUTHENTICATED_USER_MESSAGE',
        data: { type: 'AUTHENTICATED_USER', ...row },
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
      .innerJoin(
        plotPointMessages,
        eq(plotPoints.id, plotPointMessages.plotPointId),
      )
      .innerJoin(messages, eq(plotPointMessages.messageId, messages.id))
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
