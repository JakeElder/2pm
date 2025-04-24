import { and, count, eq, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import {
  environments,
  companionEnvironments,
  users,
  aiUsers,
  worldRoomEnvironments,
  plotPoints,
} from "../../db/schema";
import { DBServiceModule } from "../../db/db-service-module";
import {
  CreateEnvironmentDto,
  InferEnvironmentDto,
  CompanionEnvironmentDto,
  WorldRoomEnvironmentDto,
} from ".";

export default class Environments extends DBServiceModule {
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

      if (type === "COMPANION") {
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

        const [companionEnvironment] = await tx
          .insert(companionEnvironments)
          .values({
            userId,
            companionUserId,
            environmentId: environment.id,
          })
          .returning();

        const res: CompanionEnvironmentDto = {
          type: "COMPANION",
          data: {
            user,
            companionUser,
            companionAiUser,
            environment,
            companionEnvironment,
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
      .where(eq(aiUsers.id, "NIKO"))
      .innerJoin(users, eq(users.id, aiUsers.userId));

    return user.id;
  }

  async getEnvironmentMessageCount(environmentId: number) {
    const [{ count: messageCount }] = await this.drizzle
      .select({ count: count() })
      .from(plotPoints)
      .where(
        and(
          eq(plotPoints.environmentId, environmentId),
          inArray(plotPoints.type, ["AI_USER_MESSAGE", "HUMAN_USER_MESSAGE"]),
        ),
      );
    return messageCount;
  }

  async findCompanionEnvironmentByUserId(
    id: number,
  ): Promise<CompanionEnvironmentDto | null> {
    const userAlias = alias(users, "user");
    const companionUserAlias = alias(users, "companionUser");

    const [data] = await this.drizzle
      .select({
        environment: environments,
        companionEnvironment: companionEnvironments,
        user: userAlias,
        companionUser: companionUserAlias,
        companionAiUser: aiUsers,
      })
      .from(companionEnvironments)
      .innerJoin(
        environments,
        eq(companionEnvironments.environmentId, environments.id),
      )
      .innerJoin(userAlias, eq(companionEnvironments.userId, userAlias.id))
      .innerJoin(
        companionUserAlias,
        eq(companionEnvironments.companionUserId, companionUserAlias.id),
      )
      .innerJoin(aiUsers, eq(companionUserAlias.id, aiUsers.userId))
      .where(eq(companionEnvironments.userId, id));

    if (!data) {
      return null;
    }

    const dto: CompanionEnvironmentDto = {
      type: "COMPANION",
      data,
    };

    return dto;
  }

  async findCompanionEnvironments(): Promise<CompanionEnvironmentDto[]> {
    const userAlias = alias(users, "user");
    const companionUserAlias = alias(users, "companionUser");

    const res = await this.drizzle
      .select({
        environment: environments,
        companionEnvironment: companionEnvironments,
        user: userAlias,
        companionUser: companionUserAlias,
        companionAiUser: aiUsers,
      })
      .from(environments)
      .innerJoin(
        companionEnvironments,
        eq(environments.id, companionEnvironments.environmentId),
      )
      .innerJoin(userAlias, eq(companionEnvironments.userId, userAlias.id))
      .innerJoin(
        companionUserAlias,
        eq(companionEnvironments.companionUserId, companionUserAlias.id),
      )
      .innerJoin(aiUsers, eq(companionUserAlias.id, aiUsers.userId));

    return res.map((data) => {
      const environment: CompanionEnvironmentDto = {
        type: "COMPANION",
        data,
      };

      return environment;
    });
  }
}
