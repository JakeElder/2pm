import DBService from '@2pm/db';
import { plotPoints } from '@2pm/data/schema';
import { Inject, Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';

@Injectable()
export class PlotPointsService {
  constructor(@Inject('DB') private readonly db: DBService) {}

  async findAllByEnvironmentId(id: number) {
    const res = await this.db.drizzle
      .select()
      .from(plotPoints)
      .where(eq(plotPoints.environmentId, id))
      .orderBy(desc(plotPoints.id));

    return res;
  }
}
