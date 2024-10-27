import {
  users,
  anonymousUsers,
  aiUsers,
  environments,
  worldRoomEnvironments,
} from "@2pm/data/schema";
import {
  AiUserDto,
  AnonymousUserDto,
  CreateUserDto,
  InferUserDto,
} from "@2pm/data";
import { eq } from "drizzle-orm";
import { DbModule } from "./db-module";

export default class Users extends DbModule {
  public async insert<T extends CreateUserDto>(
    dto: T,
  ): Promise<InferUserDto<T>> {
    const { transaction } = this.drizzle;
    const { type } = dto;

    return transaction(async (tx) => {
      const [user] = await tx.insert(users).values({ type }).returning();

      if (dto.type === "ANONYMOUS") {
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

        const [anonymousUser] = await tx
          .insert(anonymousUsers)
          .values({ userId: user.id, locationEnvironmentId: environment.id })
          .returning();

        const res: AnonymousUserDto = {
          type: "ANONYMOUS",
          data: {
            user,
            anonymousUser,
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
}
