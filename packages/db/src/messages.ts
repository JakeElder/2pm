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
  CreateAiMessageDto,
  CreateHumanMessageDto,
  CreateMessageDto,
  HumanMessageDto,
  InferMessageDto,
  UpdateMessageDto,
} from "@2pm/data";
import { eq } from "drizzle-orm";

export default class Messages extends DbModule {
  public async insert<T extends CreateMessageDto>(
    dto: T,
  ): Promise<InferMessageDto<T>> {
    const { type, userId, environmentId } = dto;

    const [[environment], [{ user, aiUser, humanUser }]] = await Promise.all([
      this.drizzle
        .select()
        .from(environments)
        .where(eq(environments.id, environmentId))
        .limit(1),
      this.drizzle
        .select({ user: users, humanUser: humanUsers, aiUser: aiUsers })
        .from(users)
        .leftJoin(aiUsers, eq(users.id, userId))
        .leftJoin(humanUsers, eq(users.id, userId))
        .where(eq(users.id, userId))
        .limit(1),
    ]);

    if (!environment || !user) {
      throw new Error();
    }

    if (type === "AI") {
      if (!aiUser) {
        throw new Error();
      }

      const { state, content } = dto;

      const { message, plotPoint, aiMessage } = await this.insertAiMessage({
        environmentId,
        userId,
        state,
        content,
      });

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
      if (!humanUser) {
        throw new Error();
      }

      const { content } = dto;

      const { message, plotPoint, humanMessage } =
        await this.insertHumanMessage({
          environmentId,
          userId,
          content,
        });

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

  private async insertHumanMessage({
    userId,
    environmentId,
    content,
  }: Omit<CreateHumanMessageDto, "type">): Promise<
    Omit<HumanMessageDto, "type" | "user" | "humanUser" | "environment">
  > {
    return this.drizzle.transaction(async (tx) => {
      const [plotPoint] = await tx
        .insert(plotPoints)
        .values({ type: "HUMAN_MESSAGE", environmentId })
        .returning();

      const [message] = await tx
        .insert(messages)
        .values({ type: "HUMAN", userId, environmentId })
        .returning();

      const [humanMessage] = await tx
        .insert(humanMessages)
        .values({ messageId: message.id, content })
        .returning();

      const [plotPointMessage] = await tx
        .insert(plotPointMessages)
        .values({ plotPointId: plotPoint.id, messageId: message.id })
        .returning();

      return {
        plotPoint,
        plotPointMessage,
        message,
        humanMessage,
      };
    });
  }

  private async insertAiMessage({
    userId,
    environmentId,
    content,
    state,
  }: Omit<CreateAiMessageDto, "type">): Promise<
    Omit<AiMessageDto, "type" | "user" | "aiUser" | "environment">
  > {
    return this.drizzle.transaction(async (tx) => {
      const [plotPoint] = await tx
        .insert(plotPoints)
        .values({ type: "AI_MESSAGE", environmentId })
        .returning();

      const [message] = await tx
        .insert(messages)
        .values({ type: "AI", userId, environmentId })
        .returning();

      const [aiMessage] = await tx
        .insert(aiMessages)
        .values({ messageId: message.id, state, content })
        .returning();

      const [plotPointMessage] = await tx
        .insert(plotPointMessages)
        .values({ plotPointId: plotPoint.id, messageId: message.id })
        .returning();

      return {
        plotPoint,
        plotPointMessage,
        message,
        aiMessage,
      };
    });
  }
}
