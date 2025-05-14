import { eq, and, isNull, sql } from "drizzle-orm";
import {
  aiUsers,
  environments,
  humanUsers,
  plotPointEnvironmentPresences,
  plotPoints,
  userEnvironmentPresences,
  users,
} from "../../db/app.schema";
import { DBServiceModule } from "../../db/db-service-module";
import {
  CreateUserEnvironmentPresenceDto,
  UserEnvironmentPresenceDto,
} from ".";
import Users from "../user/user.service";

export default class UserEnvironmentPresences extends DBServiceModule {
  public async create({
    userId,
    environmentId,
  }: CreateUserEnvironmentPresenceDto): Promise<UserEnvironmentPresenceDto | null> {
    const [[environment], [{ user, humanUser, aiUser }]] = await Promise.all([
      this.app.drizzle
        .select()
        .from(environments)
        .where(eq(environments.id, environmentId))
        .limit(1),
      this.app.drizzle
        .select({
          user: users,
          humanUser: humanUsers,
          aiUser: aiUsers,
        })
        .from(users)
        .leftJoin(humanUsers, eq(humanUsers.userId, users.id))
        .leftJoin(aiUsers, eq(aiUsers.userId, users.id))
        .where(eq(users.id, userId))
        .limit(1),
    ]);

    if (!environment || !user) {
      throw new Error();
    }

    const res: UserEnvironmentPresenceDto | null =
      await this.app.drizzle.transaction(async (tx) => {
        const [current] = await tx
          .select({
            userEnvironmentPresence: userEnvironmentPresences,
            environment: environments,
          })
          .from(userEnvironmentPresences)
          .innerJoin(
            environments,
            eq(environments.id, userEnvironmentPresences.environmentId),
          )
          .where(
            and(
              eq(userEnvironmentPresences.userId, userId),
              isNull(userEnvironmentPresences.expired),
            ),
          );

        let previous: UserEnvironmentPresenceDto["previous"] = null;

        if (current) {
          if (current.environment.id === environmentId) {
            return null;
          }

          const [previousUserEnvironmentPresence] = await tx
            .update(userEnvironmentPresences)
            .set({ expired: sql`NOW()` })
            .where(
              eq(
                userEnvironmentPresences.id,
                current.userEnvironmentPresence.id,
              ),
            )
            .returning();

          const [leftPlotPoint] = await tx
            .insert(plotPoints)
            .values({
              type: "ENVIRONMENT_LEFT",
              userId,
              environmentId: previousUserEnvironmentPresence.environmentId,
            })
            .returning();

          await tx.insert(plotPointEnvironmentPresences).values({
            plotPointId: leftPlotPoint.id,
            userEnvironmentPresenceId: previousUserEnvironmentPresence.id,
          });

          previous = {
            userEnvironmentPresence: previousUserEnvironmentPresence,
            environment: current.environment,
            plotPoint: leftPlotPoint,
            user: Users.discriminate({ user, humanUser, aiUser }),
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
            environment,
            userEnvironmentPresence,
            user: Users.discriminate({ user, humanUser, aiUser }),
          },
        };
      });

    return res;
  }
}
