import { AiUserDto, AnonymousUserDto, HumanUserDto, UserDto } from '@2pm/data';
import { aiUsers, anonymousUsers, humanUsers, users } from '@2pm/data/schema';
import DBService from '@2pm/db';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject('DB') private readonly db: DBService) {}

  async findAll(): Promise<UserDto[]> {
    const res = await this.db.drizzle
      .select({
        user: users,
        anonymousUser: anonymousUsers,
        aiUser: aiUsers,
        humanUser: humanUsers,
      })
      .from(users)
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId))
      .leftJoin(anonymousUsers, eq(users.id, anonymousUsers.userId));

    const data: UserDto[] = res.map((row) => {
      if (row.user.type === 'ANONYMOUS') {
        const res: AnonymousUserDto = {
          id: row.user.id,
          type: 'ANONYMOUS',
          tag: row.user.tag,
          locationEnvironmentId: row.anonymousUser!.locationEnvironmentId,
        };
        return res;
      }

      if (row.user.type === 'HUMAN') {
        const res: HumanUserDto = {
          id: row.user.id,
          type: 'HUMAN',
          tag: row.user.tag,
          locationEnvironmentId: row.humanUser!.locationEnvironmentId,
        };
        return res;
      }

      if (row.user.type === 'AI') {
        const res: AiUserDto = {
          id: row.user.id,
          type: 'AI',
          tag: row.user.tag,
          code: row.aiUser!.code,
        };
        return res;
      }

      throw new Error();
    });

    return data;
  }
}
