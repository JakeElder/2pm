import CharacterEngine from '@2pm/character-engine';
import { PlotPointDto } from '@2pm/data';
import { Inject, Injectable } from '@nestjs/common';
import { EnvironmentGateway } from './environments.gateway';
import DBService from '@2pm/db';
import { and, count, eq, inArray } from 'drizzle-orm';
import { plotPoints } from '@2pm/data/schema';

@Injectable()
export class EnvironmentService {
  constructor(
    @Inject('CE') private readonly ce: CharacterEngine,
    @Inject('DB') private readonly db: DBService,
    private readonly environmentsGateway: EnvironmentGateway,
  ) {}

  respondCompanionOneToOne(environmentId: number) {
    // const environment = this.getEnvironmentByEnvironmentId(environmentId);
    // this.ce.evaluate(environment);
  }

  async getEnvironmentMessageCount(environmentId: number) {
    const [{ count: messageCount }] = await this.db.drizzle
      .select({ count: count() })
      .from(plotPoints)
      .where(
        and(
          eq(plotPoints.environmentId, environmentId),
          inArray(plotPoints.type, [
            'AI_USER_MESSAGE',
            'AUTHENTICATED_USER_MESSAGE',
          ]),
        ),
      );
    return messageCount;
  }
}
