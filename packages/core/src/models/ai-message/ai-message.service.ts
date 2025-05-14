import { eq, desc, and, SQL } from "drizzle-orm";
import {
  aiMessages,
  aiUsers,
  environments,
  messages,
  plotPoints,
  users,
} from "../../db/app.schema";
import {
  AiMessageDto,
  CreateAiMessageDto,
  FilterAiMessagesDto,
  FilterAiMessagesDtoSchema,
  UpdateAiMessageDto,
} from "./ai-message.dto";
import { DBServiceModule } from "../../db/db-service-module";

export default class AiMessages extends DBServiceModule {
  public async create({
    userId,
    environmentId,
    content,
    state,
  }: CreateAiMessageDto): Promise<AiMessageDto> {
    const [[environment], [aiUser]] = await Promise.all([
      this.app.drizzle
        .select()
        .from(environments)
        .where(eq(environments.id, environmentId))
        .limit(1),
      this.app.drizzle
        .select()
        .from(aiUsers)
        .where(eq(aiUsers.userId, userId))
        .limit(1),
    ]);

    if (!environment || !aiUser) {
      throw new Error();
    }

    const [plotPoint] = await this.app.drizzle
      .insert(plotPoints)
      .values({ type: "AI_MESSAGE", environmentId, userId })
      .returning();

    const [message] = await this.app.drizzle
      .insert(messages)
      .values({
        type: "AI",
        environmentId,
        userId,
        plotPointId: plotPoint.id,
      })
      .returning();

    const [aiMessage] = await this.app.drizzle
      .insert(aiMessages)
      .values({ messageId: message.id, content, state })
      .returning();

    return {
      plotPoint,
      aiMessage,
      environment,
      aiUser,
    };
  }

  async update({ id, ...rest }: UpdateAiMessageDto): Promise<AiMessageDto> {
    const r = this.app.drizzle
      .update(aiMessages)
      .set({ ...rest })
      .where(eq(aiMessages.id, id))
      .returning();

    const [aiMessage] = await r;

    const res = this.app.drizzle
      .select({
        plotPoint: plotPoints,
        environment: environments,
        aiUser: aiUsers,
      })
      .from(aiMessages)
      .innerJoin(messages, eq(messages.id, aiMessages.messageId))
      .innerJoin(users, eq(users.id, messages.userId))
      .innerJoin(aiUsers, eq(aiUsers.userId, users.id))
      .innerJoin(environments, eq(environments.id, messages.environmentId))
      .innerJoin(plotPoints, eq(plotPoints.id, messages.plotPointId))
      .where(eq(aiMessages.id, aiMessage.id));

    const [{ aiUser, environment, plotPoint }] = await res;

    return {
      aiMessage,
      aiUser,
      environment,
      plotPoint,
    };
  }

  async findAll(filter: FilterAiMessagesDto = {}): Promise<AiMessageDto[]> {
    const { id, limit } = FilterAiMessagesDtoSchema.parse(filter);

    const filters: SQL[] = [];

    if (id) {
      filters.push(eq(aiMessages.id, id));
    }

    const res = await this.app.drizzle
      .select({
        plotPoint: plotPoints,
        aiMessage: aiMessages,
        aiUser: aiUsers,
        environment: environments,
      })
      .from(messages)
      .innerJoin(plotPoints, eq(messages.plotPointId, plotPoints.id))
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(environments, eq(messages.environmentId, environments.id))
      .innerJoin(aiMessages, eq(messages.id, aiMessages.messageId))
      .innerJoin(aiUsers, eq(users.id, aiUsers.userId))
      .where(and(...filters))
      .limit(limit ? limit : Number.MAX_SAFE_INTEGER)
      .orderBy(desc(aiMessages.id));

    return res;
  }
}
