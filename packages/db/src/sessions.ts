import { users, sessions } from "@2pm/data/schema";
import { DBService } from "./db-module";
import { CreateSessionDto, FindSessionsQueryDto, SessionDto } from "@2pm/data";
import { inArray, SQL, and, eq } from "drizzle-orm";

export default class Sessions extends DBService {
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
