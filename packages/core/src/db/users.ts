import {
  users,
  humanUsers,
  aiUsers,
  environments,
  worldRoomEnvironments,
} from "@2pm/core/schema";
import {
  AiUserDto,
  HumanUserDto,
  CreateUserDto,
  InferUserDto,
  UserDto,
} from "@2pm/core";
import { eq } from "drizzle-orm";
import { DBService } from "./db-module";

export default class Users extends DBService {
  public async insert<T extends CreateUserDto>(
    dto: T,
  ): Promise<InferUserDto<T>> {
    const { transaction } = this.drizzle;
    const { type } = dto;

    return transaction(async (tx) => {
      const [user] = await tx.insert(users).values({ type }).returning();

      if (dto.type === "HUMAN") {
        const [{ environment }] = await this.drizzle
          .select({ environment: environments })
          .from(worldRoomEnvironments)
          .where(eq(worldRoomEnvironments.id, "UNIVERSE"))
          .innerJoin(
            environments,
            eq(environments.id, worldRoomEnvironments.environmentId),
          );

        if (!environment) {
          throw new Error();
        }

        const [humanUser] = await tx
          .insert(humanUsers)
          .values({ userId: user.id, locationEnvironmentId: environment.id })
          .returning();

        const res: HumanUserDto = {
          type: "HUMAN",
          data: {
            user,
            humanUser,
          },
        };

        return res as InferUserDto<T>;
      }

      if (dto.type === "AI") {
        const { id, tag, bio } = dto;

        const [aiUser] = await tx
          .insert(aiUsers)
          .values({ userId: user.id, tag, id, bio })
          .returning();

        const res: AiUserDto = {
          type: "AI",
          userId: user.id,
          id: aiUser.id,
          tag: aiUser.tag,
          bio: aiUser.bio,
        };

        return res as InferUserDto<T>;
      }

      throw new Error();
    });
  }

  async findHumanUserById(
    id: HumanUserDto["data"]["user"]["id"],
  ): Promise<HumanUserDto | null> {
    const res = await this.drizzle
      .select({
        user: users,
        humanUser: humanUsers,
      })
      .from(users)
      .innerJoin(humanUsers, eq(users.id, humanUsers.userId))
      .where(eq(users.id, id))
      .limit(1);

    if (res.length === 1) {
      const user: HumanUserDto = {
        type: "HUMAN",
        data: res[0],
      };

      return user;
    }

    return null;
  }

  async findHumanUsers(): Promise<HumanUserDto[]> {
    const res = await this.drizzle
      .select({
        user: users,
        humanUser: humanUsers,
      })
      .from(users)
      .innerJoin(humanUsers, eq(users.id, humanUsers.userId));

    return res.map((row) => {
      const user: HumanUserDto = {
        type: "HUMAN",
        data: {
          user: row.user,
          humanUser: row.humanUser,
        },
      };

      return user;
    });
  }

  async findAll(): Promise<UserDto[]> {
    const res = await this.drizzle
      .select({
        user: users,
        humanUser: humanUsers,
        aiUser: aiUsers,
      })
      .from(users)
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId));

    const data: UserDto[] = res.map((row) => {
      if (row.user.type === "HUMAN") {
        const { user, humanUser } = row;

        if (!humanUser) {
          throw new Error();
        }

        const res: HumanUserDto = {
          type: "HUMAN",
          data: {
            user,
            humanUser,
          },
        };

        return res;
      }

      if (row.user.type === "AI") {
        if (!row.aiUser) {
          throw new Error();
        }
        const res: AiUserDto = {
          type: "AI",
          id: row.aiUser.id,
          userId: row.user.id,
          tag: row.aiUser.tag,
          bio: row.aiUser.bio,
        };
        return res;
      }

      throw new Error();
    });

    return data;
  }
}
