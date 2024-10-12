import CharacterEngine from '@2pm/character-engine';
import { HydratedPlotPointDto } from '@2pm/data';
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

  sendPlotPointCreatedEvent(plotPoint: HydratedPlotPointDto) {
    this.environmentsGateway.sendPlotPointCreated(plotPoint);
  }

  async getEnvironmentMessageCount(environmentId: number) {
    const [{ count: messageCount }] = await this.db.drizzle
      .select({ count: count() })
      .from(plotPoints)
      .where(
        and(
          eq(plotPoints.environmentId, environmentId),
          inArray(plotPoints.type, ['AI_MESSAGE', 'HUMAN_MESSAGE']),
        ),
      );
    return messageCount;
  }
}
