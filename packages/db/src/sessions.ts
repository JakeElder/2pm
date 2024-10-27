import { users, sessions } from "@2pm/data/schema";
import { DbModule } from "./db-module";
import { CreateSessionDto, SessionDto } from "@2pm/data";
import { eq } from "drizzle-orm";

export default class Sessions extends DbModule {
  public async insert<T extends CreateSessionDto>(dto: T): Promise<SessionDto> {
    const { userId } = dto;

    const [user] = await this.drizzle
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const [session] = await this.drizzle
      .insert(sessions)
      .values({ userId: user.id })
      .returning();

    return { session, user };
  }
}
