import {
  messages,
  aiUserMessages,
  environments,
  users,
  aiUsers,
  plotPoints,
} from "@2pm/data/schema";
import { DBService } from "./db-module";
import {
  AiUserMessageDto,
  AiUserMessageDtoSchema,
  FindMessagesQueryDto,
  InferMessageDto,
  MessageDto,
  MessageDtoSchema,
  UpdateMessageDto,
} from "@2pm/data";
import { eq, desc, and, SQL } from "drizzle-orm";

export default class Messages extends DBService {
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

  async findAll({ type }: FindMessagesQueryDto): Promise<MessageDto[]> {
    const filters: SQL[] = [];

    if (type) {
      filters.push(eq(messages.type, type));
    }

    const res = await this.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        aiUserMessage: aiUserMessages,
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
      .where(and(...filters))
      .orderBy(desc(messages.id));

    const data: MessageDto[] = res.map((row) => {
      return MessageDtoSchema.parse({ type: row.message.type, ...row });
    });

    return data;
  }

  async findAiUser(): Promise<AiUserMessageDto[]> {
    const res = await this.findAll({ type: "AI_USER" });
    return res.map((row) => AiUserMessageDtoSchema.parse(row));
  }
}
