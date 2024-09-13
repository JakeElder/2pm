import { Inject, Injectable } from '@nestjs/common';
import type { DB } from '@2pm/schemas';
import { actors } from '@2pm/schemas/drizzle';
import { eq } from 'drizzle-orm';

@Injectable()
export class ActorsService {
  constructor(@Inject('DB') private db: DB) {}

  async findAll() {
    return this.db.query.actors.findMany();
  }

  async findOne(id: number) {
    return this.db.query.actors.findFirst({
      where: eq(actors.id, id),
    });
  }
}
