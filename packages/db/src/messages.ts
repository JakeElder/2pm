import {
  messages,
  aiUserMessages,
  environments,
  users,
  aiUsers,
  plotPoints,
} from "@2pm/data/schema";
import { DbModule } from "./db-module";
import { AiUserMessageDto, InferMessageDto, UpdateMessageDto } from "@2pm/data";
import { eq } from "drizzle-orm";

export default class Messages extends DbModule {
  public async update<T extends UpdateMessageDto>(
    dto: T,
  ): Promise<InferMessageDto<T>> {
    const { type, id } = dto;

    const [{ plotPoint, aiUser, environment, aiUserMessageId, user, message }] =
      await this.drizzle
        .select({
          plotPoint: plotPoints,
          message: messages,
          aiUserMessageId: aiUserMessages.id,
          user: users,
          aiUser: aiUsers,
          environment: environments,
        })
        .from(messages)
        .innerJoin(plotPoints, eq(messages.plotPointId, plotPoints.id))
        .innerJoin(users, eq(messages.userId, users.id))
        .innerJoin(environments, eq(messages.environmentId, environments.id))
        .leftJoin(aiUserMessages, eq(messages.id, aiUserMessages.messageId))
        .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
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

    throw new Error();
  }
}
