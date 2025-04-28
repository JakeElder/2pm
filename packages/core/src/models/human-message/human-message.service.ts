import { eq, desc, and, SQL } from "drizzle-orm";
import { CoreDBServiceModule } from "../../db/core/core-db-service-module";
import {
  humanUsers,
  environments,
  messages,
  plotPoints,
  users,
  humanMessages,
} from "../../db/core/core.schema";
import {
  HumanMessageDto,
  CreateHumanMessageDto,
  FilterHumanMessagesDto,
  FilterHumanMessagesDtoSchema,
} from "./human-message.dto";
import { HumanMessage } from "./human-message.types";

export default class HumanMessages extends CoreDBServiceModule {
  public async create({
    userId,
    environmentId,
    content,
  }: CreateHumanMessageDto): Promise<HumanMessageDto> {
    const [[environment], [humanUser]] = await Promise.all([
      this.drizzle
        .select()
        .from(environments)
        .where(eq(environments.id, environmentId))
        .limit(1),
      this.drizzle
        .select()
        .from(humanUsers)
        .where(eq(humanUsers.userId, userId))
        .limit(1),
    ]);

    if (!environment || !humanUser) {
      throw new Error();
    }

    const res: HumanMessageDto = await this.drizzle.transaction(async (tx) => {
      const [plotPoint] = await tx
        .insert(plotPoints)
        .values({ type: "HUMAN_MESSAGE", environmentId, userId })
        .returning();

      const [message] = await tx
        .insert(messages)
        .values({
          type: "HUMAN",
          environmentId,
          userId,
          plotPointId: plotPoint.id,
        })
        .returning();

      const [humanMessage] = await tx
        .insert(humanMessages)
        .values({ messageId: message.id, content })
        .returning();

      return {
        plotPoint,
        humanMessage,
        environment,
        humanUser,
      };
    });

    return res;
  }

  public async findAll(
    filter: FilterHumanMessagesDto = {},
  ): Promise<HumanMessageDto[]> {
    const { id, limit } = FilterHumanMessagesDtoSchema.parse(filter);

    const filters: SQL[] = [];

    if (id) {
      filters.push(eq(humanMessages.id, id));
    }

    const res = await this.drizzle
      .select({
        plotPoint: plotPoints,
        humanMessage: humanMessages,
        humanUser: humanUsers,
        environment: environments,
      })
      .from(messages)
      .innerJoin(plotPoints, eq(messages.plotPointId, plotPoints.id))
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(environments, eq(messages.environmentId, environments.id))
      .innerJoin(humanMessages, eq(messages.id, humanMessages.messageId))
      .innerJoin(humanUsers, eq(users.id, humanUsers.userId))
      .where(and(...filters))
      .limit(limit ? limit : Number.MAX_SAFE_INTEGER)
      .orderBy(desc(humanMessages.id));

    return res;
  }

  public async delete(id: HumanMessage["id"]) {
    const res = await this.drizzle
      .select({
        message: messages,
        humanMessage: humanMessages,
        plotPoint: plotPoints,
      })
      .from(humanMessages)
      .where(eq(humanMessages.id, id))
      .innerJoin(messages, eq(humanMessages.messageId, messages.id))
      .innerJoin(plotPoints, eq(messages.plotPointId, plotPoints.id))
      .limit(1);

    if (res.length === 0) {
      throw new Error();
    }

    const { message, humanMessage } = res[0];

    await this.drizzle.transaction(async (tx) => {
      await tx.delete(humanMessages).where(eq(humanMessages.id, id));
      await tx.delete(messages).where(eq(messages.id, humanMessage.messageId));
      await tx.delete(plotPoints).where(eq(plotPoints.id, message.plotPointId));
    });
  }
}
