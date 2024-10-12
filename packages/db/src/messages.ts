import {
  messages,
  humanMessages,
  aiMessages,
  environments,
  users,
  aiUsers,
  humanUsers,
  plotPoints,
  plotPointMessages,
} from "@2pm/data/schema";
import { DbModule } from "./db-module";
import {
  AiMessageDto,
  HumanMessageDto,
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
        aiMessageId,
        user,
        humanUser,
        humanMessageId,
        message,
      },
    ] = await this.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        aiMessageId: aiMessages.id,
        humanMessageId: humanMessages.id,
        user: users,
        aiUser: aiUsers,
        humanUser: humanUsers,
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
      .leftJoin(aiMessages, eq(messages.id, aiMessages.messageId))
      .leftJoin(humanMessages, eq(messages.id, humanMessages.messageId))
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId))
      .where(eq(messages.id, id));

    if (!environment || !user) {
      throw new Error();
    }

    if (type === "AI") {
      if (!aiUser || !aiMessageId) {
        throw new Error();
      }

      const { state, content } = dto;

      const [aiMessage] = await this.drizzle
        .update(aiMessages)
        .set({ state, content })
        .where(eq(aiMessages.id, aiMessageId))
        .returning();

      const res: AiMessageDto = {
        type: "AI",
        plotPoint,
        message,
        aiMessage,
        environment,
        user,
        aiUser,
      };

      return res as InferMessageDto<T>;
    }

    if (type === "HUMAN") {
      if (!humanUser || !humanMessageId) {
        throw new Error();
      }

      const { content } = dto;

      const [humanMessage] = await this.drizzle
        .update(humanMessages)
        .set({ content })
        .where(eq(humanMessages.id, humanMessageId))
        .returning();

      const res: HumanMessageDto = {
        type: "HUMAN",
        plotPoint,
        message,
        humanMessage,
        environment,
        user,
        humanUser,
      };

      return res as InferMessageDto<T>;
    }

    throw new Error();
  }
}
