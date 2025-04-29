import { desc, eq, and, inArray } from "drizzle-orm";
import { CoreDBServiceModule } from "../../db/core/core-db-service-module";
import {
  aiMessages,
  aiUsers,
  environments,
  humanMessages,
  humanUsers,
  messages,
  plotPoints,
  users,
} from "../../db/core/core.schema";
import {
  AiMessagePlotPointDto,
  EnvironmentEnteredPlotPointDto,
  FilterPlotPointsDto,
  HumanMessagePlotPointDto,
  PlotPointDto,
} from "./plot-point.dto";
import { HumanMessageDtoSchema } from "../human-message/human-message.dto";
import { AiMessageDtoSchema } from "../ai-message/ai-message.dto";

export default class PlotPoints extends CoreDBServiceModule {
  async findByEnvironmentId(id: number, { types, limit }: FilterPlotPointsDto) {
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
      })
      .from(plotPoints)
      .innerJoin(users, eq(plotPoints.userId, users.id))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .leftJoin(messages, eq(messages.plotPointId, plotPoints.id))
      .leftJoin(humanMessages, eq(messages.id, humanMessages.messageId))
      .leftJoin(aiMessages, eq(messages.id, aiMessages.messageId))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId))
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .where(
        and(
          eq(plotPoints.environmentId, id),
          types && types.length > 0
            ? inArray(plotPoints.type, types)
            : undefined,
        ),
      )
      .orderBy(desc(plotPoints.id));

    if (limit) {
      query.limit(limit);
    }

    const res = await query;

    const data: (PlotPointDto | null)[] = res.map((row) => {
      if (row.plotPoint.type === "HUMAN_MESSAGE") {
        const { user, humanUser, humanMessage, message } = row;

        if (!user || !humanUser || !humanMessage || !message) {
          throw new Error();
        }

        const res: HumanMessagePlotPointDto = {
          type: "HUMAN_MESSAGE",
          data: HumanMessageDtoSchema.parse(row),
        };

        return res;
      }

      if (row.plotPoint.type === "AI_MESSAGE") {
        const { user, aiUser, aiMessage, message } = row;

        if (!user || !aiUser || !aiMessage || !message) {
          throw new Error();
        }

        const res: AiMessagePlotPointDto = {
          type: "AI_MESSAGE",
          data: AiMessageDtoSchema.parse(row),
        };

        return res;
      }

      if (row.plotPoint.type === "ENVIRONMENT_ENTERED") {
        const { user, environment } = row;

        if (!user || !environment) {
          console.dir(row);
          throw new Error();
        }

        const res: EnvironmentEnteredPlotPointDto = {
          type: "ENVIRONMENT_ENTERED",
          data: row,
        };

        return res;
      }

      throw new Error(`${row.plotPoint.type} not implemented`);
    });

    return data;
  }
}
