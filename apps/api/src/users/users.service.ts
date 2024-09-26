import { Inject, Injectable } from '@nestjs/common';
import DBService from '@2pm/db';
import { users } from '@2pm/schemas/drizzle';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject('DB') private db: DBService) {}

  findAll() {
    return this.db.drizzle.select().from(users).execute();
  }

  async findOne(id: number) {
    const res = await this.db.drizzle
      .select()
      .from(users)
      .where(eq(users.id, id));
    return res.length ? res[0] : null;
  }
}
