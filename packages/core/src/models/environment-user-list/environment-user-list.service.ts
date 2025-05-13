import { eq, and, isNull, desc } from "drizzle-orm";
import { AppDBServiceModule } from "../../db/app/app-db-service-module";
import {
  aiUsers,
  environments,
  humanUsers,
  userEnvironmentPresences,
  users,
} from "../../db/app/app.schema";
import { EnvironmentUserListDto } from "./environment-user-list.dto";
import { Environment } from "../environment/environment.types";
import Users from "../user/user.service";

export default class EnvironmentUserLists extends AppDBServiceModule {
  async find(id: Environment["id"]): Promise<EnvironmentUserListDto> {
    const res = await this.drizzle
      .select({
        user: users,
        humanUser: humanUsers,
        aiUser: aiUsers,
        environment: environments,
      })
      .from(userEnvironmentPresences)
      .innerJoin(
        environments,
        eq(userEnvironmentPresences.environmentId, environments.id),
      )
      .innerJoin(users, eq(userEnvironmentPresences.userId, users.id))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId))
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .where(
        and(
          eq(userEnvironmentPresences.environmentId, id),
          isNull(userEnvironmentPresences.expired),
        ),
      )
      .orderBy(desc(users.type));

    return {
      users: res.map((row) => Users.discriminate(row)),
    };
  }
}
