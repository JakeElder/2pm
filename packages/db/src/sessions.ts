import {
  users,
  authenticatedUsers,
  anonymousUsers,
  sessions,
} from "@2pm/data/schema";
import { DbModule } from "./db-module";
import {
  CreateSessionDto,
  InferSessionDto,
  AnonymousSessionDto,
  AuthenticatedSessionDto,
} from "@2pm/data";
import { eq } from "drizzle-orm";

export default class Sessions extends DbModule {
  public async insert<T extends CreateSessionDto>(
    dto: T,
  ): Promise<InferSessionDto<T>> {
    const { userId, type } = dto;

    const [{ user, anonymousUser, authenticatedUser }] = await this.drizzle
      .select({
        user: users,
        anonymousUser: anonymousUsers,
        authenticatedUser: authenticatedUsers,
      })
      .from(users)
      .leftJoin(anonymousUsers, eq(anonymousUsers.userId, userId))
      .leftJoin(authenticatedUsers, eq(authenticatedUsers.userId, userId))
      .where(eq(users.id, userId))
      .limit(1);

    if (type === "ANONYMOUS" && !anonymousUser) {
      throw new Error();
    }

    if (type === "AUTHENTICATED" && !authenticatedUser) {
      throw new Error();
    }

    const [session] = await this.drizzle
      .insert(sessions)
      .values({ userId: user.id })
      .returning();

    if (type === "ANONYMOUS") {
      if (!anonymousUser) {
        throw new Error();
      }
      const res: AnonymousSessionDto = {
        type: "ANONYMOUS",
        data: {
          anonymousUser,
          session,
          user,
        },
      };

      return res as InferSessionDto<T>;
    }

    if (type === "AUTHENTICATED") {
      if (!authenticatedUser) {
        throw new Error();
      }
      const res: AuthenticatedSessionDto = {
        type: "AUTHENTICATED",
        data: {
          authenticatedUser,
          session,
          user,
        },
      };

      return res as InferSessionDto<T>;
    }

    throw new Error();
  }
}
