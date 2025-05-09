import { eq, and, isNull, sql } from "drizzle-orm";
import {
  environments,
  plotPointEnvironmentPresences,
  plotPoints,
  userEnvironmentPresences,
} from "../../db/core/core.schema";
import { CoreDBServiceModule } from "../../db/core/core-db-service-module";
import {
  CreateUserEnvironmentPresenceDto,
  UserEnvironmentPresenceDto,
} from ".";

export default class UserEnvironmentPresences extends CoreDBServiceModule {
  public async create({
    userId,
    environmentId,
  }: CreateUserEnvironmentPresenceDto): Promise<UserEnvironmentPresenceDto | null> {
    const [environment] = await this.drizzle
      .select()
      .from(environments)
      .where(eq(environments.id, environmentId))
      .limit(1);

    if (!environment) {
      throw new Error();
    }

    const res: UserEnvironmentPresenceDto | null =
      await this.drizzle.transaction(async (tx) => {
        const [current] = await tx
          .select()
          .from(userEnvironmentPresences)
          .where(
            and(
              eq(userEnvironmentPresences.userId, userId),
              isNull(userEnvironmentPresences.expired),
            ),
          );

        let previous: UserEnvironmentPresenceDto["previous"] = null;

        if (current) {
          if (current.environmentId === environmentId) {
            return null;
          }

          const [previousUserEnvironmentPresence] = await tx
            .update(userEnvironmentPresences)
            .set({ expired: sql`NOW()` })
            .where(eq(userEnvironmentPresences.id, current.id))
            .returning();

          const [leftPlotPoint] = await tx
            .insert(plotPoints)
            .values({
              type: "ENVIRONMENT_LEFT",
              userId,
              environmentId: previousUserEnvironmentPresence.environmentId,
            })
            .returning();

          previous = {
            userEnvironmentPresence: previousUserEnvironmentPresence,
            plotPoint: leftPlotPoint,
          };
        }

        const [plotPoint] = await tx
          .insert(plotPoints)
          .values({ type: "ENVIRONMENT_ENTERED", userId, environmentId })
          .returning();

        const [userEnvironmentPresence] = await tx
          .insert(userEnvironmentPresences)
          .values({ userId, environmentId })
          .returning();

        await tx.insert(plotPointEnvironmentPresences).values({
          plotPointId: plotPoint.id,
          userEnvironmentPresenceId: userEnvironmentPresence.id,
        });

        return {
          previous,
          next: {
            plotPoint,
            userEnvironmentPresence,
          },
        };
      });

    return res;
  }
}
