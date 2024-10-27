import {
  environments,
  companionOneToOneEnvironments,
  users,
  aiUsers,
  worldRoomEnvironments,
} from "@2pm/data/schema";
import { DbModule } from "./db-module";
import {
  CreateEnvironmentDto,
  InferEnvironmentDto,
  CompanionOneToOneEnvironmentDto,
  WorldRoomEnvironmentDto,
} from "@2pm/data";
import { eq } from "drizzle-orm";

export default class Environments extends DbModule {
  public async insert<T extends CreateEnvironmentDto>(
    dto: T,
  ): Promise<InferEnvironmentDto<T>> {
    const { transaction } = this.drizzle;
    const { type } = dto;

    return transaction(async (tx) => {
      const [environment] = await tx
        .insert(environments)
        .values({ type })
        .returning();

      if (type === "WORLD_ROOM") {
        const { id } = dto;

        const [worldRoomEnvironment] = await tx
          .insert(worldRoomEnvironments)
          .values({
            id,
            environmentId: environment.id,
          })
          .returning();

        const res: WorldRoomEnvironmentDto = {
          type: "WORLD_ROOM",
          data: {
            environment,
            worldRoomEnvironment,
          },
        };

        return res as InferEnvironmentDto<T>;
      }

      if (type === "COMPANION_ONE_TO_ONE") {
        const { userId } = dto;
        const companionUserId =
          dto.companionUserId ?? (await this.getDefaultCompanionUserId());

        const [user] = await this.drizzle
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        const [{ companionUser, companionAiUser }] = await this.drizzle
          .select({
            companionUser: users,
            companionAiUser: aiUsers,
          })
          .from(users)
          .where(eq(users.id, companionUserId))
          .innerJoin(aiUsers, eq(users.id, aiUsers.userId));

        if (!user || !companionUser || !companionAiUser) {
          throw new Error();
        }

        const [companionOneToOneEnvironment] = await tx
          .insert(companionOneToOneEnvironments)
          .values({
            userId,
            companionUserId,
            environmentId: environment.id,
          })
          .returning();

        const res: CompanionOneToOneEnvironmentDto = {
          type: "COMPANION_ONE_TO_ONE",
          data: {
            user,
            companionUser,
            companionAiUser,
            environment,
            companionOneToOneEnvironment,
          },
        };

        return res as InferEnvironmentDto<T>;
      }

      throw new Error();
    });
  }

  async getDefaultCompanionUserId() {
    const [{ user }] = await this.drizzle
      .select({ user: users })
      .from(aiUsers)
      .where(eq(aiUsers.id, "IVAN"))
      .innerJoin(users, eq(users.id, aiUsers.userId));

    return user.id;
  }
}
