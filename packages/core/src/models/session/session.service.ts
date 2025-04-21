import { inArray, SQL, and, eq } from "drizzle-orm";
import { users, sessions } from "../../db/schema";
import { DBServiceModule } from "../../db/db-service-module";
import { CreateSessionDto, FindSessionsQueryDto, SessionDto } from ".";

export default class Sessions extends DBServiceModule {
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

  async find({ limit, ids }: FindSessionsQueryDto): Promise<SessionDto[]> {
    const filters: SQL[] = [];

    if (ids) {
      filters.push(inArray(sessions.id, ids));
    }

    const builder = this.drizzle
      .select({ session: sessions, user: users })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(and(...filters));

    return await (limit ? builder.limit(limit) : builder);
  }
}
