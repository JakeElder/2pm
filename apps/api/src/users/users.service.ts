import {
  AiUserDto,
  HumanUserDto,
  CreateUserDto,
  InferUserDto,
  UserDto,
} from '@2pm/data';
import { aiUsers, humanUsers, users } from '@2pm/data/schema';
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

  async findHumanUsers(): Promise<HumanUserDto[]> {
    const res = await this.db.drizzle
      .select({
        user: users,
        humanUser: humanUsers,
      })
      .from(users)
      .innerJoin(humanUsers, eq(users.id, humanUsers.userId));

    return res.map((row) => {
      const user: HumanUserDto = {
        type: 'HUMAN',
        data: {
          user: row.user,
          humanUser: row.humanUser,
        },
      };

      return user;
    });
  }

  async findAll(): Promise<UserDto[]> {
    const res = await this.db.drizzle
      .select({
        user: users,
        humanUser: humanUsers,
        aiUser: aiUsers,
      })
      .from(users)
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId));

    const data: UserDto[] = res.map((row) => {
      if (row.user.type === 'HUMAN') {
        const { user, humanUser } = row;

        if (!humanUser) {
          throw new Error();
        }

        const res: HumanUserDto = {
          type: 'HUMAN',
          data: {
            user,
            humanUser,
          },
        };

        return res;
      }

      if (row.user.type === 'AI') {
        if (!row.aiUser) {
          throw new Error();
        }
        const res: AiUserDto = {
          type: 'AI',
          id: row.aiUser.id,
          userId: row.user.id,
          tag: row.aiUser.tag,
          bio: row.aiUser.bio,
        };
        return res;
      }

      throw new Error();
    });

    return data;
  }
}
