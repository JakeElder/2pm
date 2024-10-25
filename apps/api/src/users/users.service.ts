import {
  AiUserDto,
  AnonymousUserDto,
  AuthenticatedUserDto,
  CreateUserDto,
  InferUserDto,
  UserDto,
} from '@2pm/data';
import {
  aiUsers,
  anonymousUsers,
  authenticatedUsers,
  users,
} from '@2pm/data/schema';
import DBService from '@2pm/db';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject('DB') private readonly db: DBService) {}

  public async create<T extends CreateUserDto>(
    dto: T,
  ): Promise<InferUserDto<T>> {
    return this.db.users.insert(dto);
  }

  async findAnonymousUsers(): Promise<AnonymousUserDto[]> {
    const res = await this.db.drizzle
      .select({
        user: users,
        anonymousUser: anonymousUsers,
      })
      .from(users)
      .innerJoin(anonymousUsers, eq(users.id, anonymousUsers.userId));

    return res.map((row) => {
      const user: AnonymousUserDto = {
        type: 'ANONYMOUS',
        data: {
          user: row.user,
          anonymousUser: row.anonymousUser,
        },
      };

      return user;
    });
  }

  async findAll(): Promise<UserDto[]> {
    const res = await this.db.drizzle
      .select({
        user: users,
        anonymousUser: anonymousUsers,
        aiUser: aiUsers,
        authenticatedUser: authenticatedUsers,
      })
      .from(users)
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .leftJoin(authenticatedUsers, eq(users.id, authenticatedUsers.userId))
      .leftJoin(anonymousUsers, eq(users.id, anonymousUsers.userId));

    const data: UserDto[] = res.map((row) => {
      if (row.user.type === 'ANONYMOUS') {
        const { user, anonymousUser } = row;

        if (!anonymousUser) {
          throw new Error();
        }

        const res: AnonymousUserDto = {
          type: 'ANONYMOUS',
          data: {
            user,
            anonymousUser,
          },
        };

        return res;
      }

      if (row.user.type === 'AUTHENTICATED') {
        if (!row.authenticatedUser) {
          throw new Error();
        }
        const res: AuthenticatedUserDto = {
          id: row.user.id,
          type: 'AUTHENTICATED',
          tag: row.authenticatedUser.tag,
          locationEnvironmentId: row.authenticatedUser.locationEnvironmentId,
        };
        return res;
      }

      if (row.user.type === 'AI') {
        if (!row.aiUser) {
          throw new Error();
        }
        const res: AiUserDto = {
          id: row.user.id,
          type: 'AI',
          tag: row.aiUser.tag,
          code: row.aiUser.code,
          bio: row.aiUser.bio,
        };
        return res;
      }

      throw new Error();
    });

    return data;
  }
}
