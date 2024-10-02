import DBService from '@2pm/db';
import { AiMessage } from '@2pm/schemas';
import {
  aiMessages,
  aiUsers,
  environments,
  messages,
  plotPointMessages,
  plotPoints,
  users,
} from '@2pm/schemas/drizzle';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class AiMessagesService {
  constructor(@Inject('DB') private readonly db: DBService) {}

  async getAiMessageByPlotPointId(plotPointId: number): Promise<AiMessage> {
    const result = await this.db.drizzle
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
      .innerJoin(environments, eq(messages.environmentId, environments.id))
      .where(eq(plotPoints.id, plotPointId))
      .limit(1);

    if (result.length === 0) {
      throw new Error(`No AI message found for plot point ID: ${plotPointId}`);
    }

    const { plotPoint, message, aiMessage, user, aiUser, environment } =
      result[0];

    return {
      plotPoint,
      message,
      aiMessage,
      user,
      aiUser,
      environment,
    };
  }
}
