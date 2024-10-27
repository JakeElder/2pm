import { CreateSessionDto, FindSessionsQueryDto, SessionDto } from '@2pm/data';
import { humanUsers, sessions, users } from '@2pm/data/schema';
import DBService from '@2pm/db';
import { Inject, Injectable } from '@nestjs/common';
import { inArray, SQL, and, eq } from 'drizzle-orm';

@Injectable()
export class SessionsService {
  constructor(@Inject('DB') private readonly db: DBService) {}

  public async create(dto: CreateSessionDto) {
    return this.db.sessions.insert(dto);
  }

  async find({ limit, ids }: FindSessionsQueryDto): Promise<SessionDto[]> {
    const filters: SQL[] = [];

    if (ids) {
      filters.push(inArray(sessions.id, ids));
    }

    const builder = this.db.drizzle
      .select({ session: sessions, user: users })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(and(...filters));

    return await (limit ? builder.limit(limit) : builder);
  }
}
