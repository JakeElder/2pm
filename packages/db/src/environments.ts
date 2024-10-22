import {
  environments,
  companionOneToOneEnvironments,
  users,
  aiUsers,
} from "@2pm/data/schema";
import { DbModule } from "./db-module";
import {
  CreateEnvironmentDto,
  InferEnvironmentDto,
  CompanionOneToOneEnvironmentDto,
} from "@2pm/data";
import { eq } from "drizzle-orm";

export default class Environments extends DbModule {
  public async insert<T extends CreateEnvironmentDto>(
    dto: T,
  ): Promise<InferEnvironmentDto<T>> {
    const { transaction } = this.drizzle;
    const { id, type, userId } = dto;

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

    return transaction(async (tx) => {
      const [environment] = await tx
        .insert(environments)
        .values({ id, type })
        .returning();

      if (type === "COMPANION_ONE_TO_ONE") {
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
    return 2;
  }
}
