import {
  plotPoints,
  environments,
  users,
  aiUsers,
  humanUsers,
  messages,
  humanMessages,
  plotPointMessages,
  aiMessages,
} from "@2pm/data/schema";
import { DbModule } from "./db-module";
import {
  AiMessageDto,
  AiMessagePlotPointDto,
  CreateAiMessagePlotPointDto,
  CreateHumanMessagePlotPointDto,
  CreatePlotPointDto,
  HumanMessageDto,
  HumanMessagePlotPointDto,
  InferPlotPointDto,
} from "@2pm/data";
import { eq } from "drizzle-orm";

export default class PlotPoints extends DbModule {
  public async insert<T extends CreatePlotPointDto>(
    dto: T,
  ): Promise<InferPlotPointDto<T>> {
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

    if (type === "HUMAN_MESSAGE") {
      if (!humanUser) {
        throw new Error();
      }

      const { content } = dto;

      const { message, plotPoint, humanMessage } =
        await this.insertHumanMessagePlotPoint({
          environmentId,
          userId,
          content,
        });

      const res: HumanMessagePlotPointDto = {
        type: "HUMAN_MESSAGE",
        data: {
          type: "HUMAN",
          plotPoint,
          message,
          humanMessage,
          environment,
          user,
          humanUser,
        },
      };

      return res as InferPlotPointDto<T>;
    }

    if (type === "AI_MESSAGE") {
      if (!aiUser) {
        throw new Error();
      }

      const { state, content } = dto;

      const { message, plotPoint, aiMessage } =
        await this.insertAiMessagePlotPoint({
          environmentId,
          userId,
          state,
          content,
        });

      const res: AiMessagePlotPointDto = {
        type: "AI_MESSAGE",
        data: {
          type: "AI",
          plotPoint,
          message,
          aiMessage,
          environment,
          user,
          aiUser,
        },
      };

      return res as InferPlotPointDto<T>;
    }

    throw new Error();
  }

  private async insertHumanMessagePlotPoint({
    userId,
    environmentId,
    content,
  }: Omit<CreateHumanMessagePlotPointDto, "type">): Promise<
    Pick<HumanMessageDto, "plotPoint" | "message" | "humanMessage">
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

  private async insertAiMessagePlotPoint({
    userId,
    environmentId,
    content,
    state,
  }: Omit<CreateAiMessagePlotPointDto, "type">): Promise<
    Pick<AiMessageDto, "plotPoint" | "message" | "aiMessage">
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
