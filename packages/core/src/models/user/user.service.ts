import { eq } from "drizzle-orm";
import { CoreDBServiceModule } from "../../db/core/core-db-service-module";
import {
  humanUsers,
  environments,
  aiUsers,
  users,
  userEnvironmentPresences,
} from "../../db/core/core.schema";
import { AiUserDto, AnonymousUserDto, AuthenticatedUserDto } from "./user.dto";
import { shorten } from "../../utils";
import { UserDto } from "./user.types";

export default class Users extends CoreDBServiceModule {
  async findByEnvironmentId(id: number): Promise<UserDto[]> {
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
      .where(eq(userEnvironmentPresences.environmentId, id))
      .orderBy(users.type);

    const data = res.map(({ user, aiUser, humanUser }) => {
      if (user.type === "HUMAN") {
        if (!humanUser) {
          throw new Error();
        }

        const hash = shorten(humanUser.id);

        if (humanUser.tag) {
          const dto: AuthenticatedUserDto = {
            type: "AUTHENTICATED",
            data: { ...humanUser, hash },
          };

          return dto;
        }

        const dto: AnonymousUserDto = {
          type: "ANONYMOUS",
          data: { ...humanUser, hash },
        };

        return dto;
      }

      if (user.type === "AI") {
        if (!aiUser) {
          throw new Error();
        }

        const dto: AiUserDto = {
          type: "AI",
          data: aiUser,
        };

        return dto;
      }

      throw new Error();
    });

    return data;
  }
}
