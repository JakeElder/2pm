import { CreateAiMessageDto, AiMessageDto } from "@2pm/data/dtos";
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
  }: CreateAiMessageDto): Promise<AiMessageDto> {
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

    const { plotPoint, message, aiMessage } = await this.drizzle.transaction(
      async (tx) => {
        const [plotPoint] = await tx
          .insert(plotPoints)
          .values({
            type: "AI_MESSAGE",
            userId,
            environmentId,
          })
          .returning();

        const [message] = await tx
          .insert(messages)
          .values({
            type: "AI",
            content,
            userId,
            environmentId,
          })
          .returning();

        const [aiMessage] = await tx
          .insert(aiMessages)
          .values({ messageId: message.id })
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
      user,
      aiUser,
      environment,
      plotPoint,
      aiMessage,
      message,
    };
  }
}
