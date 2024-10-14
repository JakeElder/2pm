import {
  messages,
  authenticatedUserMessages,
  aiUserMessages,
  environments,
  users,
  aiUsers,
  authenticatedUsers,
  plotPoints,
  plotPointMessages,
} from "@2pm/data/schema";
import { DbModule } from "./db-module";
import {
  AiUserMessageDto,
  AuthenticatedUserMessageDto,
  InferMessageDto,
  UpdateMessageDto,
} from "@2pm/data";
import { eq } from "drizzle-orm";

export default class Messages extends DbModule {
  public async update<T extends UpdateMessageDto>(
    dto: T,
  ): Promise<InferMessageDto<T>> {
    const { type, id } = dto;

    const [
      {
        plotPoint,
        aiUser,
        environment,
        aiUserMessageId,
        user,
        authenticatedUser,
        authenticatedUserMessageId,
        message,
      },
    ] = await this.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        aiUserMessageId: aiUserMessages.id,
        authenticatedUserMessageId: authenticatedUserMessages.id,
        user: users,
        aiUser: aiUsers,
        authenticatedUser: authenticatedUsers,
        environment: environments,
      })
      .from(messages)
      .innerJoin(
        plotPointMessages,
        eq(messages.id, plotPointMessages.messageId),
      )
      .innerJoin(plotPoints, eq(plotPointMessages.plotPointId, plotPoints.id))
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(environments, eq(messages.environmentId, environments.id))
      .leftJoin(aiUserMessages, eq(messages.id, aiUserMessages.messageId))
      .leftJoin(
        authenticatedUserMessages,
        eq(messages.id, authenticatedUserMessages.messageId),
      )
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .leftJoin(authenticatedUsers, eq(users.id, authenticatedUsers.userId))
      .where(eq(messages.id, id));

    if (!environment || !user) {
      throw new Error();
    }

    if (type === "AI_USER") {
      if (!aiUser || !aiUserMessageId) {
        throw new Error();
      }

      const { state, content } = dto;

      const [aiUserMessage] = await this.drizzle
        .update(aiUserMessages)
        .set({ state, content })
        .where(eq(aiUserMessages.id, aiUserMessageId))
        .returning();

      const res: AiUserMessageDto = {
        type: "AI_USER",
        plotPoint,
        message,
        aiUserMessage,
        environment,
        user,
        aiUser,
      };

      return res as InferMessageDto<T>;
    }

    if (type === "AUTHENTICATED_USER") {
      if (!authenticatedUser || !authenticatedUserMessageId) {
        throw new Error();
      }

      const { content } = dto;

      const [authenticatedUserMessage] = await this.drizzle
        .update(authenticatedUserMessages)
        .set({ content })
        .where(eq(authenticatedUserMessages.id, authenticatedUserMessageId))
        .returning();

      const res: AuthenticatedUserMessageDto = {
        type: "AUTHENTICATED_USER",
        plotPoint,
        message,
        authenticatedUserMessage,
        environment,
        user,
        authenticatedUser,
      };

      return res as InferMessageDto<T>;
    }

    throw new Error();
  }
}
