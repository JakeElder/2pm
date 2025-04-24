import { eq } from "drizzle-orm";
import { users, sessions, humanUsers } from "../../db/schema";
import { DBServiceModule } from "../../db/db-service-module";
import { CreateSessionDto, SessionDto } from "./session.dto";
import { Session } from "./session.types";

export default class Sessions extends DBServiceModule {
  public async insert<T extends CreateSessionDto>(dto: T): Promise<SessionDto> {
    const { userId } = dto;

    const [humanUser] = await this.drizzle
      .select()
      .from(humanUsers)
      .where(eq(humanUsers.userId, userId))
      .limit(1);

    const [session] = await this.drizzle
      .insert(sessions)
      .values({ userId: humanUser.userId })
      .returning();

    return { session, humanUser };
  }

  async find(id: Session["id"]): Promise<SessionDto | null> {
    const res = await this.drizzle
      .select({
        session: sessions,
        humanUser: humanUsers,
      })
      .from(sessions)
      .where(eq(sessions.id, id))
      .innerJoin(users, eq(users.id, sessions.userId))
      .innerJoin(humanUsers, eq(humanUsers.userId, users.id))
      .limit(1);

    if (res.length === 0) {
      return null;
    }

    return res[0];
  }
}
