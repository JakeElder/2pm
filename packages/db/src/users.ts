import {
  users,
  authenticatedUsers,
  anonymousUsers,
  aiUsers,
  environments,
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
    const { id, type } = dto;

    return transaction(async (tx) => {
      const [user] = await tx.insert(users).values({ id, type }).returning();

      if (dto.type === "ANONYMOUS") {
        const { locationEnvironmentId } = dto;

        const [environment] = await this.drizzle
          .select()
          .from(environments)
          .where(eq(environments.id, locationEnvironmentId))
          .limit(1);

        if (!environment) {
          throw new Error();
        }

        const [anonymousUser] = await tx
          .insert(anonymousUsers)
          .values({ userId: user.id, locationEnvironmentId })
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
        const { code, tag } = dto;

        const [aiUser] = await tx
          .insert(aiUsers)
          .values({ userId: user.id, tag, code })
          .returning();

        const res: AiUserDto = {
          id: user.id,
          type: "AI",
          tag: aiUser.tag,
          code: aiUser.code,
        };

        return res as InferUserDto<T>;
      }

      throw new Error();
    });
  }
}
