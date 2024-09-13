import { Inject, Injectable } from '@nestjs/common';
import type { DB } from '@2pm/schemas';
import { users } from '@2pm/schemas/drizzle';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject('DB') private db: DB) {}

  async findAll() {
    return this.db.select().from(users);
  }

  async findOne(id: number) {
    const res = await this.db.select().from(users).where(eq(users.id, id));
    return res.length ? res[0] : null;
  }
}
