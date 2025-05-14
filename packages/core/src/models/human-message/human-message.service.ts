import { eq, desc, and, SQL } from "drizzle-orm";
import { DBServiceModule } from "../../db/db-service-module";
import {
  humanUsers,
  environments,
  messages,
  plotPoints,
  users,
  humanMessages,
} from "../../db/app.schema";
import {
  HumanMessageDto,
  CreateHumanMessageDto,
  FilterHumanMessagesDto,
  FilterHumanMessagesDtoSchema,
} from "./human-message.dto";
import { HumanMessage } from "./human-message.types";
import HumanUsers from "../human-user/human-user.service";

export default class HumanMessages extends DBServiceModule {
  public async create({
    userId,
    environmentId,
    json,
    text,
  }: CreateHumanMessageDto): Promise<HumanMessageDto> {
    const [[environment], [humanUser]] = await Promise.all([
      this.app.drizzle
        .select()
        .from(environments)
        .where(eq(environments.id, environmentId))
        .limit(1),
      this.app.drizzle
        .select()
        .from(humanUsers)
        .where(eq(humanUsers.userId, userId))
        .limit(1),
    ]);

    if (!environment || !humanUser) {
      throw new Error();
    }

    const res: HumanMessageDto = await this.app.drizzle.transaction(
      async (tx) => {
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
          .values({
            messageId: message.id,
            json,
            text,
          })
          .returning();

        return {
          plotPoint,
          humanMessage,
          environment,
          user: HumanUsers.discriminate(humanUser),
        };
      },
    );

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

    const res = await this.app.drizzle
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

    return res.map((r) => {
      return {
        ...r,
        user: HumanUsers.discriminate(r.humanUser),
      };
    });
  }

  public async delete(id: HumanMessage["id"]) {
    const res = await this.app.drizzle
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

    await this.app.drizzle.transaction(async (tx) => {
      await tx.delete(humanMessages).where(eq(humanMessages.id, id));
      await tx.delete(messages).where(eq(messages.id, humanMessage.messageId));
      await tx.delete(plotPoints).where(eq(plotPoints.id, message.plotPointId));
    });
  }
}
