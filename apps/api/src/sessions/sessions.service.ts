import {
  AnonymousSessionDto,
  AuthenticatedSessionDto,
  FindSessionsQueryDto,
  SessionDto,
} from '@2pm/data';
import { anonymousUsers, humanUsers, sessions, users } from '@2pm/data/schema';
import DBService from '@2pm/db';
import { Inject, Injectable } from '@nestjs/common';
import { inArray, SQL, and, eq } from 'drizzle-orm';

@Injectable()
export class SessionsService {
  constructor(@Inject('DB') private readonly db: DBService) {}

  async find({ limit, ids }: FindSessionsQueryDto): Promise<SessionDto[]> {
    const filters: SQL[] = [];

    if (ids) {
      filters.push(inArray(sessions.id, ids));
    }

    const builder = this.db.drizzle
      .select({
        session: sessions,
        user: users,
        anonymousUser: anonymousUsers,
        humanUser: humanUsers,
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .leftJoin(anonymousUsers, eq(users.id, anonymousUsers.userId))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId))
      .where(and(...filters));

    const res = await (limit ? builder.limit(limit) : builder);

    return res.map((row) => {
      const { session, user } = row;

      if (user.type === 'ANONYMOUS') {
        const { anonymousUser } = row;

        if (!anonymousUser) {
          throw new Error();
        }

        const res: AnonymousSessionDto = {
          type: 'ANONYMOUS',
          data: { user, session, anonymousUser },
        };

        return res;
      }

      if (row.user.type === 'HUMAN') {
        const { humanUser } = row;

        if (!humanUser) {
          throw new Error();
        }

        const res: AuthenticatedSessionDto = {
          type: 'AUTHENTICATED',
          data: { user, session, humanUser },
        };

        return res;
      }

      throw new Error();
    });
  }
}
