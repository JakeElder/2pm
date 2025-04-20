import {
  environments,
  companionOneToOneEnvironments,
  users,
  aiUsers,
  worldRoomEnvironments,
  plotPoints,
} from "@2pm/core/schema";
import { DBService } from "./db-module";
import {
  CreateEnvironmentDto,
  InferEnvironmentDto,
  CompanionOneToOneEnvironmentDto,
  WorldRoomEnvironmentDto,
} from "@2pm/core";
import { and, count, eq, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export default class Environments extends DBService {
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

  async findCompanionOneToOneEnvironmentByUserId(
    id: number,
  ): Promise<CompanionOneToOneEnvironmentDto | null> {
    const userAlias = alias(users, "user");
    const companionUserAlias = alias(users, "companionUser");

    const [data] = await this.drizzle
      .select({
        environment: environments,
        companionOneToOneEnvironment: companionOneToOneEnvironments,
        user: userAlias,
        companionUser: companionUserAlias,
        companionAiUser: aiUsers,
      })
      .from(companionOneToOneEnvironments)
      .innerJoin(
        environments,
        eq(companionOneToOneEnvironments.environmentId, environments.id),
      )
      .innerJoin(
        userAlias,
        eq(companionOneToOneEnvironments.userId, userAlias.id),
      )
      .innerJoin(
        companionUserAlias,
        eq(
          companionOneToOneEnvironments.companionUserId,
          companionUserAlias.id,
        ),
      )
      .innerJoin(aiUsers, eq(companionUserAlias.id, aiUsers.userId))
      .where(eq(companionOneToOneEnvironments.userId, id));

    if (!data) {
      return null;
    }

    const dto: CompanionOneToOneEnvironmentDto = {
      type: "COMPANION_ONE_TO_ONE",
      data,
    };

    return dto;
  }

  async findCompanionOneToOneEnvironments(): Promise<
    CompanionOneToOneEnvironmentDto[]
  > {
    const userAlias = alias(users, "user");
    const companionUserAlias = alias(users, "companionUser");

    const res = await this.drizzle
      .select({
        environment: environments,
        companionOneToOneEnvironment: companionOneToOneEnvironments,
        user: userAlias,
        companionUser: companionUserAlias,
        companionAiUser: aiUsers,
      })
      .from(environments)
      .innerJoin(
        companionOneToOneEnvironments,
        eq(environments.id, companionOneToOneEnvironments.environmentId),
      )
      .innerJoin(
        userAlias,
        eq(companionOneToOneEnvironments.userId, userAlias.id),
      )
      .innerJoin(
        companionUserAlias,
        eq(
          companionOneToOneEnvironments.companionUserId,
          companionUserAlias.id,
        ),
      )
      .innerJoin(aiUsers, eq(companionUserAlias.id, aiUsers.userId));

    return res.map((data) => {
      const environment: CompanionOneToOneEnvironmentDto = {
        type: "COMPANION_ONE_TO_ONE",
        data,
      };

      return environment;
    });
  }
}
