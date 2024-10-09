import {
  CreateAiMessageDto,
  AiMessageHydratedPlotPointDto,
  UpdateAiMessageDto,
  AiMessageDto,
} from "@2pm/data";
import {
  environments,
  aiMessages,
  aiUsers,
  messages,
  plotPointMessages,
  plotPoints,
  users,
} from "@2pm/data/schema";
import { eq } from "drizzle-orm";
import { DbModule } from "./db-module";

export default class AiMessages extends DbModule {
  public async insert({
    userId,
    environmentId,
    content,
  }: CreateAiMessageDto): Promise<AiMessageHydratedPlotPointDto> {
    const [[environment], [{ user, aiUser }]] = await Promise.all([
      this.drizzle
        .select()
        .from(environments)
        .where(eq(environments.id, environmentId))
        .limit(1),
      this.drizzle
        .select({ user: users, aiUser: aiUsers })
        .from(users)
        .innerJoin(aiUsers, eq(users.id, userId))
        .where(eq(users.id, userId))
        .limit(1),
    ]);

    if (!environment || !user || !aiUser) {
      throw new Error();
    }

    if (user.type === "HUMAN") {
      throw new Error("Must be Ai user");
    }

    const { plotPoint, message, aiMessage } = await this.drizzle.transaction(
      async (tx) => {
        const [plotPoint] = await tx
          .insert(plotPoints)
          .values({ type: "AI_MESSAGE", environmentId })
          .returning();

        const [message] = await tx
          .insert(messages)
          .values({
            type: "AI",
            userId,
            environmentId,
          })
          .returning();

        const [aiMessage] = await tx
          .insert(aiMessages)
          .values({
            messageId: message.id,
            content,
          })
          .returning();

        const [plotPointMessage] = await tx
          .insert(plotPointMessages)
          .values({
            plotPointId: plotPoint.id,
            messageId: message.id,
          })
          .returning();

        return {
          plotPoint,
          plotPointMessage,
          message,
          aiMessage,
        };
      },
    );

    return {
      ...plotPoint,
      type: "AI_MESSAGE",
      data: {
        user,
        aiUser,
        environment,
        aiMessage,
        message,
      },
    };
  }

  public async update({
    aiMessageId,
    content,
  }: UpdateAiMessageDto): Promise<AiMessageDto> {
    const [aiMessage] = await this.drizzle
      .update(aiMessages)
      .set({ content })
      .where(eq(aiMessages.id, aiMessageId))
      .returning();

    if (!aiMessage) {
      throw new Error();
    }

    return aiMessage;
  }
}
