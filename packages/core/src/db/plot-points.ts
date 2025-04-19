import {
  plotPoints,
  environments,
  users,
  aiUsers,
  messages,
  aiUserMessages,
  humanUsers,
  humanUserMessages,
  evaluations,
  tools,
} from "@2pm/core/schema";
import { DBService } from "./db-module";
import {
  AiUserMessageDto,
  AiUserMessagePlotPointDto,
  CreateAiUserMessagePlotPointDto,
  CreatePlotPointDto,
  InferPlotPointDto,
  HumanUserMessagePlotPointDto,
  CreateHumanUserMessagePlotPointDto,
  HumanUserMessageDto,
  CreateEvaluationPlotPointDto,
  EvaluationPlotPointDto,
  PlotPointDto,
} from "@2pm/core";
import { desc, eq, and, inArray } from "drizzle-orm";

export default class PlotPoints extends DBService {
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
        .select({
          user: users,
          humanUser: humanUsers,
          aiUser: aiUsers,
        })
        .from(users)
        .leftJoin(humanUsers, eq(users.id, userId))
        .leftJoin(aiUsers, eq(users.id, userId))
        .where(eq(users.id, userId))
        .limit(1),
    ]);

    if (!environment || !user) {
      throw new Error();
    }

    if (type === "HUMAN_USER_MESSAGE") {
      if (!humanUser) {
        throw new Error();
      }

      const { content } = dto;

      const { message, plotPoint, humanUserMessage } =
        await this.insertHumanUserMessagePlotPoint({
          environmentId,
          userId,
          content,
        });

      const res: HumanUserMessagePlotPointDto = {
        type: "HUMAN_USER_MESSAGE",
        data: {
          type: "HUMAN_USER",
          plotPoint,
          message,
          humanUserMessage,
          environment,
          user,
          humanUser,
        },
      };

      return res as InferPlotPointDto<T>;
    }

    if (type === "AI_USER_MESSAGE") {
      if (!aiUser) {
        throw new Error();
      }

      const { state, content } = dto;

      const { message, plotPoint, aiUserMessage } =
        await this.insertAiUserMessagePlotPoint({
          environmentId,
          userId,
          state,
          content,
        });

      const res: AiUserMessagePlotPointDto = {
        type: "AI_USER_MESSAGE",
        data: {
          type: "AI_USER",
          plotPoint,
          message,
          aiUserMessage,
          environment,
          user,
          aiUser,
        },
      };

      return res as InferPlotPointDto<T>;
    }

    if (type === "EVALUATION") {
      const { toolId, args, triggerId } = dto;

      const [[tool], [trigger]] = await Promise.all([
        this.drizzle.select().from(tools).where(eq(tools.id, toolId)).limit(1),
        this.drizzle
          .select()
          .from(plotPoints)
          .where(eq(plotPoints.id, triggerId))
          .limit(1),
      ]);

      if (!aiUser || !tool) {
        throw new Error();
      }

      const { plotPoint, evaluation } = await this.insertEvaluationPlotPoint({
        environmentId,
        userId,
        toolId,
        args,
        triggerId,
      });

      const res: EvaluationPlotPointDto = {
        type: "EVALUATION",
        data: {
          plotPoint,
          trigger,
          environment,
          user,
          aiUser,
          evaluation,
          tool,
        },
      };

      return res as InferPlotPointDto<T>;
    }

    throw new Error();
  }

  private async insertEvaluationPlotPoint({
    userId,
    environmentId,
    toolId,
    args,
    triggerId,
  }: Omit<CreateEvaluationPlotPointDto, "type">): Promise<
    Pick<EvaluationPlotPointDto["data"], "plotPoint" | "evaluation">
  > {
    return this.drizzle.transaction(async (tx) => {
      const [plotPoint] = await tx
        .insert(plotPoints)
        .values({ userId, type: "EVALUATION", environmentId })
        .returning();

      const [evaluation] = await tx
        .insert(evaluations)
        .values({ plotPointId: plotPoint.id, triggerId, toolId, userId, args })
        .returning();

      return {
        plotPoint,
        evaluation,
      };
    });
  }

  private async insertHumanUserMessagePlotPoint({
    userId,
    environmentId,
    content,
  }: Omit<CreateHumanUserMessagePlotPointDto, "type">): Promise<
    Pick<HumanUserMessageDto, "plotPoint" | "message" | "humanUserMessage">
  > {
    return this.drizzle.transaction(async (tx) => {
      const [plotPoint] = await tx
        .insert(plotPoints)
        .values({ type: "HUMAN_USER_MESSAGE", userId, environmentId })
        .returning();

      const [message] = await tx
        .insert(messages)
        .values({
          type: "HUMAN_USER",
          plotPointId: plotPoint.id,
          userId,
          environmentId,
        })
        .returning();

      const [humanUserMessage] = await tx
        .insert(humanUserMessages)
        .values({ messageId: message.id, content })
        .returning();

      return {
        plotPoint,
        message,
        humanUserMessage,
      };
    });
  }

  private async insertAiUserMessagePlotPoint({
    userId,
    environmentId,
    content,
    state,
  }: Omit<CreateAiUserMessagePlotPointDto, "type">): Promise<
    Pick<AiUserMessageDto, "plotPoint" | "message" | "aiUserMessage">
  > {
    return this.drizzle.transaction(async (tx) => {
      const [plotPoint] = await tx
        .insert(plotPoints)
        .values({ type: "AI_USER_MESSAGE", userId, environmentId })
        .returning();

      const [message] = await tx
        .insert(messages)
        .values({
          type: "AI_USER",
          plotPointId: plotPoint.id,
          userId,
          environmentId,
        })
        .returning();

      const [aiUserMessage] = await tx
        .insert(aiUserMessages)
        .values({ messageId: message.id, state, content })
        .returning();

      return {
        message,
        plotPoint,
        aiUserMessage,
      };
    });
  }

  async findAllByEnvironmentId(id: number) {
    const res = await this.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        humanUserMessage: humanUserMessages,
        aiUserMessage: aiUserMessages,
        user: users,
        humanUser: humanUsers,
        aiUser: aiUsers,
        environment: environments,
      })
      .from(plotPoints)
      .leftJoin(messages, eq(messages.plotPointId, plotPoints.id))
      .leftJoin(humanUserMessages, eq(messages.id, humanUserMessages.messageId))
      .leftJoin(aiUserMessages, eq(messages.id, aiUserMessages.messageId))
      .leftJoin(users, eq(messages.userId, users.id))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId))
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .where(
        and(
          eq(plotPoints.environmentId, id),
          inArray(plotPoints.type, ["AI_USER_MESSAGE", "HUMAN_USER_MESSAGE"]),
        ),
      )
      .orderBy(desc(plotPoints.id));

    const data: PlotPointDto[] = res.map((row) => {
      if (row.plotPoint.type === "HUMAN_USER_MESSAGE") {
        const { user, humanUser, humanUserMessage, message, ...rest } = row;

        if (!user || !humanUser || !humanUserMessage || !message) {
          throw new Error();
        }

        const res: HumanUserMessagePlotPointDto = {
          type: "HUMAN_USER_MESSAGE",
          data: {
            type: "HUMAN_USER",
            ...rest,
            user,
            humanUser,
            message,
            humanUserMessage,
          },
        };

        return res;
      }

      if (row.plotPoint.type === "AI_USER_MESSAGE") {
        const { user, aiUser, aiUserMessage, message, ...rest } = row;

        if (!user || !aiUser || !aiUserMessage || !message) {
          throw new Error();
        }

        const res: AiUserMessagePlotPointDto = {
          type: "AI_USER_MESSAGE",
          data: {
            type: "AI_USER",
            ...rest,
            user,
            aiUser,
            message,
            aiUserMessage,
          },
        };

        return res;
      }

      throw new Error();
    });

    return data;
  }

  async findHumanUserMessages() {
    const res = await this.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        humanUserMessage: humanUserMessages,
        user: users,
        humanUser: humanUsers,
        environment: environments,
      })
      .from(plotPoints)
      .innerJoin(messages, eq(messages.plotPointId, plotPoints.id))
      .innerJoin(
        humanUserMessages,
        eq(messages.id, humanUserMessages.messageId),
      )
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(humanUsers, eq(users.id, humanUsers.userId))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .where(eq(plotPoints.type, "HUMAN_USER_MESSAGE"))
      .orderBy(desc(plotPoints.id));

    const data: HumanUserMessagePlotPointDto[] = res.map((row) => {
      const res: HumanUserMessagePlotPointDto = {
        type: "HUMAN_USER_MESSAGE",
        data: { type: "HUMAN_USER", ...row },
      };

      return res;
    });

    return data;
  }

  async findAiUserMessages() {
    const res = await this.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        aiUserMessage: aiUserMessages,
        user: users,
        aiUser: aiUsers,
        environment: environments,
      })
      .from(plotPoints)
      .innerJoin(messages, eq(messages.plotPointId, plotPoints.id))
      .innerJoin(aiUserMessages, eq(messages.id, aiUserMessages.messageId))
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(aiUsers, eq(users.id, aiUsers.userId))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .where(eq(plotPoints.type, "AI_USER_MESSAGE"))
      .orderBy(desc(plotPoints.id));

    const data: AiUserMessagePlotPointDto[] = res.map((row) => {
      const res: AiUserMessagePlotPointDto = {
        type: "AI_USER_MESSAGE",
        data: { type: "AI_USER", ...row },
      };

      return res;
    });

    return data;
  }
}
