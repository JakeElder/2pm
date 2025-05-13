import { asc, desc, eq, and, inArray, not } from "drizzle-orm";
import { AppDBServiceModule } from "../../db/app/app-db-service-module";
import {
  aiMessages,
  aiUsers,
  environments,
  humanMessages,
  humanUsers,
  messages,
  plotPointEnvironmentPresences,
  plotPoints,
  userEnvironmentPresences,
  users,
} from "../../db/app/app.schema";
import {
  AiMessagePlotPointDto,
  AiMessagePlotPointDtoSchema,
  EnvironmentEnteredPlotPointDto,
  EnvironmentEnteredPlotPointDtoSchema,
  EnvironmentLeftPlotPointDto,
  EnvironmentLeftPlotPointDtoSchema,
  FilterPlotPointsDto,
  HumanMessagePlotPointDto,
  HumanMessagePlotPointDtoSchema,
  PlotPointDto,
} from "./plot-point.dto";
import { HumanMessageDtoSchema } from "../human-message/human-message.dto";
import { AiMessageDtoSchema } from "../ai-message/ai-message.dto";
import Users from "../user/user.service";
import HumanUsers from "../human-user/human-user.service";
import { UserDto } from "../user/user.types";
import {
  AIMessage,
  BaseMessageLike,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

export default class PlotPoints extends AppDBServiceModule {
  async findByEnvironmentId(id: number, options: FilterPlotPointsDto = {}) {
    const { limit, types, filter, reverse } = options;

    const order = reverse
      ? asc(plotPoints.createdAt)
      : desc(plotPoints.createdAt);

    const query = this.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        humanMessage: humanMessages,
        aiMessage: aiMessages,
        user: users,
        humanUser: humanUsers,
        aiUser: aiUsers,
        environment: environments,
        plotPointEnvironmentPresence: plotPointEnvironmentPresences,
        userEnvironmentPresence: userEnvironmentPresences,
      })
      .from(plotPoints)
      .innerJoin(users, eq(plotPoints.userId, users.id))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .leftJoin(messages, eq(messages.plotPointId, plotPoints.id))
      .leftJoin(humanMessages, eq(messages.id, humanMessages.messageId))
      .leftJoin(aiMessages, eq(messages.id, aiMessages.messageId))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId))
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .leftJoin(
        plotPointEnvironmentPresences,
        eq(plotPoints.id, plotPointEnvironmentPresences.plotPointId),
      )
      .leftJoin(
        userEnvironmentPresences,
        eq(
          plotPointEnvironmentPresences.userEnvironmentPresenceId,
          userEnvironmentPresences.id,
        ),
      )
      .where(
        and(
          eq(plotPoints.environmentId, id),
          types && types.length > 0
            ? inArray(plotPoints.type, types)
            : undefined,
          filter && filter.length > 0
            ? not(inArray(plotPoints.type, filter))
            : undefined,
        ),
      )
      .orderBy(order);

    if (limit) {
      query.limit(limit);
    }

    const res = await query;

    const data: PlotPointDto[] = res.map((row) => {
      if (row.plotPoint.type === "HUMAN_MESSAGE") {
        const { humanUser, humanMessage, message } = row;

        if (!humanUser || !humanMessage || !message) {
          throw new Error();
        }

        const res: HumanMessagePlotPointDto = {
          type: "HUMAN_MESSAGE",
          data: HumanMessageDtoSchema.parse({
            ...row,
            user: HumanUsers.discriminate(humanUser),
          }),
        };

        return HumanMessagePlotPointDtoSchema.parse(res);
      }

      if (row.plotPoint.type === "AI_MESSAGE") {
        const { aiUser, aiMessage, message } = row;

        if (!aiUser || !aiMessage || !message) {
          throw new Error();
        }

        const res: AiMessagePlotPointDto = {
          type: "AI_MESSAGE",
          data: AiMessageDtoSchema.parse(row),
        };

        return AiMessagePlotPointDtoSchema.parse(res);
      }

      if (row.plotPoint.type === "ENVIRONMENT_ENTERED") {
        const { userEnvironmentPresence } = row;

        if (!userEnvironmentPresence) {
          throw new Error();
        }

        const res: EnvironmentEnteredPlotPointDto = {
          type: "ENVIRONMENT_ENTERED",
          data: {
            ...row,
            userEnvironmentPresence,
            user: Users.discriminate(row),
          },
        };

        return EnvironmentEnteredPlotPointDtoSchema.parse(res);
      }

      if (row.plotPoint.type === "ENVIRONMENT_LEFT") {
        const { userEnvironmentPresence } = row;

        if (!userEnvironmentPresence) {
          throw new Error();
        }

        const res: EnvironmentLeftPlotPointDto = {
          type: "ENVIRONMENT_LEFT",
          data: {
            ...row,
            userEnvironmentPresence,
            user: Users.discriminate(row),
          },
        };

        return EnvironmentLeftPlotPointDtoSchema.parse(res);
      }

      throw new Error(`${row.plotPoint.type} not implemented`);
    });

    return data;
  }

  toChain(plotPoints: PlotPointDto[]): BaseMessageLike[] {
    const user = (dto: UserDto) => {
      if (dto.type === "AI") {
        return {
          type: "AI",
          id: dto.data.userId,
          tag: dto.data.tag,
        };
      }

      if (dto.type === "AUTHENTICATED") {
        return {
          type: "AUTHENTICATED",
          id: dto.data.userId,
          tag: dto.data.tag,
        };
      }

      if (dto.type === "ANONYMOUS") {
        return {
          type: "AUTHENTICATED",
          id: dto.data.userId,
          tag: `anon#${dto.data.hash}`,
        };
      }

      throw new Error();
    };

    return plotPoints.map(({ type, data }) => {
      if (type === "AI_MESSAGE") {
        const context = user({ type: "AI", data: data.aiUser });
        return new AIMessage(
          `[[${JSON.stringify(context)}]][${data.aiMessage.content}]`,
        );
      }

      if (type === "HUMAN_MESSAGE") {
        const context = user(data.user);
        return new HumanMessage(
          `[[${JSON.stringify(context)}]][${data.humanMessage.text}]`,
        );
      }

      if (type === "ENVIRONMENT_ENTERED") {
        const summary = {
          type,
          time: data.plotPoint.createdAt,
          user: user(data.user),
        };
        return new SystemMessage(`PLOT_POINT: ${JSON.stringify(summary)}`);
      }

      if (type === "ENVIRONMENT_LEFT") {
        const summary = {
          type,
          time: data.plotPoint.createdAt,
          user: user(data.user),
        };
        return new SystemMessage(`PLOT_POINT: ${JSON.stringify(summary)}`);
      }

      throw new Error();
    });
  }
}
