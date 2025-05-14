import { eq, and, isNull, desc } from "drizzle-orm";
import { DBServiceModule } from "../../db/db-service-module";
import {
  humanUsers,
  environments,
  aiUsers,
  users,
  userEnvironmentPresences,
} from "../../db/app.schema";
import { User, UserDto } from "./user.types";
import HumanUsers from "../human-user/human-user.service";
import { AiUser } from "../ai-user/ai-user.types";
import { HumanUser } from "../human-user/human-user.types";

type DiscriminateData = {
  user: User;
  aiUser: AiUser | null;
  humanUser: HumanUser | null;
};

export default class Users extends DBServiceModule {
  async findByEnvironmentId(id: number): Promise<UserDto[]> {
    const res = await this.app.drizzle
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

    const data = res.map((row) => Users.discriminate(row));

    return data;
  }

  static discriminate({ user, humanUser, aiUser }: DiscriminateData): UserDto {
    if (user.type === "HUMAN") {
      if (!humanUser) {
        throw new Error();
      }
      return HumanUsers.discriminate(humanUser);
    }

    if (user.type === "AI") {
      if (!aiUser) {
        throw new Error();
      }

      return { type: "AI", data: aiUser };
    }

    throw new Error();
  }
}
