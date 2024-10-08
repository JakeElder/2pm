import {
  CreateHumanMessageDto,
  HumanMessageHydratedPlotPointDto,
} from "@2pm/data";
import {
  environments,
  humanMessages,
  humanUsers,
  messages,
  plotPointMessages,
  plotPoints,
  users,
} from "@2pm/data/schema";
import { eq } from "drizzle-orm";
import { DbModule } from "./db-module";

export default class HumanMessages extends DbModule {
  public async insert({
    userId,
    environmentId,
    content,
  }: CreateHumanMessageDto): Promise<HumanMessageHydratedPlotPointDto> {
    const [[environment], [{ user, humanUser }]] = await Promise.all([
      this.drizzle
        .select()
        .from(environments)
        .where(eq(environments.id, environmentId))
        .limit(1),
      this.drizzle
        .select({ user: users, humanUser: humanUsers })
        .from(users)
        .innerJoin(humanUsers, eq(users.id, userId))
        .where(eq(users.id, userId))
        .limit(1),
    ]);

    if (!environment || !user || !humanUser) {
      throw new Error();
    }

    if (user.type === "AI") {
      throw new Error("Must be Human user");
    }

    const { plotPoint, message, humanMessage } = await this.drizzle.transaction(
      async (tx) => {
        const [plotPoint] = await tx
          .insert(plotPoints)
          .values({ type: "HUMAN_MESSAGE", environmentId })
          .returning();

        const [message] = await tx
          .insert(messages)
          .values({
            type: "HUMAN",
            userId,
            environmentId,
          })
          .returning();

        const [humanMessage] = await tx
          .insert(humanMessages)
          .values({
            messageId: message.id,
            content,
          })
          .returning();

        const [plotPointMessage] = await tx
          .insert(plotPointMessages)
          .values({
            plotPointId: plotPoint.id,
            messageId: message.id,
          })
          .returning();

        return {
          plotPoint,
          plotPointMessage,
          message,
          humanMessage,
        };
      },
    );

    return {
      ...plotPoint,
      type: "HUMAN_MESSAGE",
      data: {
        user,
        humanUser,
        environment,
        humanMessage,
        message,
      },
    };
  }
}
