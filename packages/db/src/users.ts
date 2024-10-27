import {
  users,
  authenticatedUsers,
  anonymousUsers,
  aiUsers,
  environments,
  worldRoomEnvironments,
} from "@2pm/data/schema";
import {
  AiUserDto,
  AnonymousUserDto,
  CreateUserDto,
  AuthenticatedUserDto,
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

      if (dto.type === "AUTHENTICATED") {
        const { locationEnvironmentId, tag } = dto;

        const [authenticatedUser] = await tx
          .insert(authenticatedUsers)
          .values({ userId: user.id, tag, locationEnvironmentId })
          .returning();

        const res: AuthenticatedUserDto = {
          id: user.id,
          type: "AUTHENTICATED",
          tag: authenticatedUser.tag,
          locationEnvironmentId: authenticatedUser.locationEnvironmentId,
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
