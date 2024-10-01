import DBService from '@2pm/db';
import { type Environment } from '@2pm/schemas';
import { plotPoints } from '@2pm/schemas/drizzle';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class PlotPointsService {
  constructor(@Inject('DB') private readonly db: DBService) {}

  async findAllByEnvironment(environmentId: Environment['id']) {
    const res = await this.db.drizzle
      .select()
      .from(plotPoints)
      .where(eq(plotPoints.environmentId, environmentId));

    return res;
  }
}
