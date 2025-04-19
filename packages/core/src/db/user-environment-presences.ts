import {
  environments,
  plotPointEnvironmentPresences,
  plotPoints,
  userEnvironmentPresences,
} from "@2pm/core/schema";
import {
  CreateUserEnvironmentPresenceDto,
  UserEnvironmentPresenceDto,
} from "@2pm/core";
import { eq } from "drizzle-orm";
import { DBService } from "./db-module";

export default class UserEnvironmentPresences extends DBService {
  public async insert({
    userId,
    environmentId,
  }: CreateUserEnvironmentPresenceDto): Promise<UserEnvironmentPresenceDto> {
    const [environment] = await this.drizzle
      .select()
      .from(environments)
      .where(eq(environments.id, environmentId))
      .limit(1);

    if (!environment) {
      throw new Error();
    }

    const { userEnvironmentPresence, plotPoint } =
      await this.drizzle.transaction(async (tx) => {
        const [plotPoint] = await tx
          .insert(plotPoints)
          .values({ type: "ENVIRONMENT_ENTERED", userId, environmentId })
          .returning();

        const [userEnvironmentPresence] = await this.drizzle
          .insert(userEnvironmentPresences)
          .values({ userId, environmentId })
          .returning();

        const [plotPointEnvironmentPresence] = await tx
          .insert(plotPointEnvironmentPresences)
          .values({
            plotPointId: plotPoint.id,
            userEnvironmentPresenceId: userEnvironmentPresence.id,
          })
          .returning();

        return {
          plotPoint,
          plotPointEnvironmentPresence,
          environment,
          userEnvironmentPresence,
        };
      });

    return {
      plotPoint,
      environment,
      userEnvironmentPresence,
    };
  }
}
