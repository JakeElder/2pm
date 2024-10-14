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
} from "@2pm/data";
import { eq } from "drizzle-orm";

export default class PlotPoints extends DbModule {
  public async insert<T extends CreatePlotPointDto>(
    dto: T,
  ): Promise<InferPlotPointDto<T>> {
    const { type, userId, environmentId } = dto;

    const [[environment], [{ user, aiUser, authenticatedUser }]] =
      await Promise.all([
        this.drizzle
          .select()
          .from(environments)
          .where(eq(environments.id, environmentId))
          .limit(1),
        this.drizzle
          .select({
            user: users,
            authenticatedUser: authenticatedUsers,
            aiUser: aiUsers,
          })
          .from(users)
          .leftJoin(aiUsers, eq(users.id, userId))
          .leftJoin(authenticatedUsers, eq(users.id, userId))
          .where(eq(users.id, userId))
          .limit(1),
      ]);

    if (!environment || !user) {
      throw new Error();
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

    throw new Error();
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
