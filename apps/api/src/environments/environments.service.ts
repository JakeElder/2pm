import CharacterEngine from '@2pm/character-engine';
import {
  CompanionOneToOneEnvironmentDto,
  CreateEnvironmentDto,
  InferEnvironmentDto,
} from '@2pm/data';
import { Inject, Injectable } from '@nestjs/common';
import { EnvironmentGateway } from './environments.gateway';
import DBService from '@2pm/db';
import { and, count, eq, inArray } from 'drizzle-orm';
import {
  aiUsers,
  companionOneToOneEnvironments,
  environments,
  plotPoints,
  users,
} from '@2pm/data/schema';
import { alias } from 'drizzle-orm/pg-core';

@Injectable()
export class EnvironmentsService {
  constructor(
    @Inject('CE') private readonly ce: CharacterEngine,
    @Inject('DB') private readonly db: DBService,
    private readonly environmentsGateway: EnvironmentGateway,
  ) {}

  public async create<T extends CreateEnvironmentDto>(
    dto: T,
  ): Promise<InferEnvironmentDto<T>> {
    return this.db.environments.insert(dto);
  }

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

  async findCompanionOneToOneEnvironments(): Promise<
    CompanionOneToOneEnvironmentDto[]
  > {
    const userAlias = alias(users, 'user');
    const companionUserAlias = alias(users, 'companionUser');

    const res = await this.db.drizzle
      .select({
        environment: environments,
        companionOneToOneEnvironment: companionOneToOneEnvironments,
        user: userAlias,
        companionUser: companionUserAlias,
        companionAiUser: aiUsers,
      })
      .from(environments)
      .innerJoin(
        companionOneToOneEnvironments,
        eq(environments.id, companionOneToOneEnvironments.environmentId),
      )
      .innerJoin(
        userAlias,
        eq(companionOneToOneEnvironments.userId, userAlias.id),
      )
      .innerJoin(
        companionUserAlias,
        eq(
          companionOneToOneEnvironments.companionUserId,
          companionUserAlias.id,
        ),
      )
      .innerJoin(aiUsers, eq(companionUserAlias.id, aiUsers.userId));

    return res.map((data) => {
      const user: CompanionOneToOneEnvironmentDto = {
        type: 'COMPANION_ONE_TO_ONE',
        data,
      };

      return user;
    });
  }
}
