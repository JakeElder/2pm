import {
  plotPoints,
  environments,
  users,
  aiUsers,
  authenticatedUsers,
  messages,
  authenticatedUserMessages,
  plotPointMessages,
  aiUserMessages,
  anonymousUsers,
  anonymousUserMessages,
  evaluations,
  plotPointEvaluations,
  tools,
} from "@2pm/data/schema";
import { DbModule } from "./db-module";
import {
  AiUserMessageDto,
  AiUserMessagePlotPointDto,
  CreateAiUserMessagePlotPointDto,
  CreateAuthenticatedUserMessagePlotPointDto,
  CreatePlotPointDto,
  AuthenticatedUserMessageDto,
  AuthenticatedUserMessagePlotPointDto,
  InferPlotPointDto,
  AnonymousUserMessagePlotPointDto,
  CreateAnonymousUserMessagePlotPointDto,
  AnonymousUserMessageDto,
  CreateEvaluationPlotPointDto,
  EvaluationPlotPointDto,
} from "@2pm/data";
import { eq } from "drizzle-orm";

export default class PlotPoints extends DbModule {
  public async insert<T extends CreatePlotPointDto>(
    dto: T,
  ): Promise<InferPlotPointDto<T>> {
    const { type, userId, environmentId } = dto;

    const [
      [environment],
      [{ user, aiUser, authenticatedUser, anonymousUser }],
    ] = await Promise.all([
      this.drizzle
        .select()
        .from(environments)
        .where(eq(environments.id, environmentId))
        .limit(1),
      this.drizzle
        .select({
          user: users,
          anonymousUser: anonymousUsers,
          authenticatedUser: authenticatedUsers,
          aiUser: aiUsers,
        })
        .from(users)
        .leftJoin(anonymousUsers, eq(users.id, userId))
        .leftJoin(aiUsers, eq(users.id, userId))
        .leftJoin(authenticatedUsers, eq(users.id, userId))
        .where(eq(users.id, userId))
        .limit(1),
    ]);

    if (!environment || !user) {
      throw new Error();
    }

    if (type === "ANONYMOUS_USER_MESSAGE") {
      if (!anonymousUser) {
        throw new Error();
      }

      const { content } = dto;

      const { message, plotPoint, anonymousUserMessage } =
        await this.insertAnonymousUserMessagePlotPoint({
          environmentId,
          userId,
          content,
        });

      const res: AnonymousUserMessagePlotPointDto = {
        type: "ANONYMOUS_USER_MESSAGE",
        data: {
          type: "ANONYMOUS_USER",
          plotPoint,
          message,
          anonymousUserMessage,
          environment,
          user,
          anonymousUser,
        },
      };

      return res as InferPlotPointDto<T>;
    }

    if (type === "AUTHENTICATED_USER_MESSAGE") {
      if (!authenticatedUser) {
        throw new Error();
      }

      const { content } = dto;

      const { message, plotPoint, authenticatedUserMessage } =
        await this.insertAuthenticatedUserMessagePlotPoint({
          environmentId,
          userId,
          content,
        });

      const res: AuthenticatedUserMessagePlotPointDto = {
        type: "AUTHENTICATED_USER_MESSAGE",
        data: {
          type: "AUTHENTICATED_USER",
          plotPoint,
          message,
          authenticatedUserMessage,
          environment,
          user,
          authenticatedUser,
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
      const { toolId, args } = dto;

      const [tool] = await this.drizzle
        .select()
        .from(tools)
        .where(eq(tools.id, toolId))
        .limit(1);

      if (!aiUser || !tool) {
        throw new Error();
      }

      const { plotPoint, evaluation } = await this.insertEvaluationPlotPoint({
        environmentId,
        userId,
        toolId,
        args,
      });

      const res: EvaluationPlotPointDto = {
        type: "EVALUATION",
        data: {
          plotPoint,
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
  }: Omit<CreateEvaluationPlotPointDto, "type">): Promise<
    Pick<EvaluationPlotPointDto["data"], "plotPoint" | "evaluation">
  > {
    return this.drizzle.transaction(async (tx) => {
      const [plotPoint] = await tx
        .insert(plotPoints)
        .values({ type: "EVALUATION", environmentId })
        .returning();

      const [evaluation] = await tx
        .insert(evaluations)
        .values({ plotPointId: plotPoint.id, toolId, userId, args })
        .returning();

      const [plotPointEvaluation] = await tx
        .insert(plotPointEvaluations)
        .values({ plotPointId: plotPoint.id, evaluationId: evaluation.id })
        .returning();

      return {
        plotPoint,
        evaluation,
        plotPointEvaluation,
      };
    });
  }

  private async insertAnonymousUserMessagePlotPoint({
    userId,
    environmentId,
    content,
  }: Omit<CreateAnonymousUserMessagePlotPointDto, "type">): Promise<
    Pick<
      AnonymousUserMessageDto,
      "plotPoint" | "message" | "anonymousUserMessage"
    >
  > {
    return this.drizzle.transaction(async (tx) => {
      const [plotPoint] = await tx
        .insert(plotPoints)
        .values({ type: "ANONYMOUS_USER_MESSAGE", environmentId })
        .returning();

      const [message] = await tx
        .insert(messages)
        .values({ type: "ANONYMOUS_USER", userId, environmentId })
        .returning();

      const [anonymousUserMessage] = await tx
        .insert(anonymousUserMessages)
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
        anonymousUserMessage,
      };
    });
  }

  private async insertAuthenticatedUserMessagePlotPoint({
    userId,
    environmentId,
    content,
  }: Omit<CreateAuthenticatedUserMessagePlotPointDto, "type">): Promise<
    Pick<
      AuthenticatedUserMessageDto,
      "plotPoint" | "message" | "authenticatedUserMessage"
    >
  > {
    return this.drizzle.transaction(async (tx) => {
      const [plotPoint] = await tx
        .insert(plotPoints)
        .values({ type: "AUTHENTICATED_USER_MESSAGE", environmentId })
        .returning();

      const [message] = await tx
        .insert(messages)
        .values({ type: "AUTHENTICATED_USER", userId, environmentId })
        .returning();

      const [authenticatedUserMessage] = await tx
        .insert(authenticatedUserMessages)
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
        authenticatedUserMessage,
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
        .values({ type: "AI_USER_MESSAGE", environmentId })
        .returning();

      const [message] = await tx
        .insert(messages)
        .values({ type: "AI_USER", userId, environmentId })
        .returning();

      const [aiUserMessage] = await tx
        .insert(aiUserMessages)
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
        aiUserMessage,
      };
    });
  }
}
