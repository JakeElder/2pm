import { HydratedPlotPoint, HydratedPlotPointDtoSchema } from '@2pm/data';
import {
  aiMessages,
  aiUsers,
  environments,
  humanMessages,
  humanUsers,
  messages,
  plotPointMessages,
  plotPoints,
  users,
} from '@2pm/data/schema';
import DBService from '@2pm/db';
import { Inject, Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';

@Injectable()
export class HydratedPlotPointsService {
  constructor(@Inject('DB') private readonly db: DBService) {}

  async findAllByEnvironmentId(id: number) {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        aiMessage: aiMessages,
        humanMessage: humanMessages,
        user: users,
        aiUser: aiUsers,
        humanUser: humanUsers,
        environment: environments,
      })
      .from(plotPoints)
      .leftJoin(
        plotPointMessages,
        eq(plotPoints.id, plotPointMessages.plotPointId),
      )
      .leftJoin(messages, eq(plotPointMessages.messageId, messages.id))
      .leftJoin(aiMessages, eq(messages.id, aiMessages.messageId))
      .leftJoin(humanMessages, eq(messages.id, humanMessages.messageId))
      .leftJoin(users, eq(messages.userId, users.id))
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .where(eq(plotPoints.environmentId, id))
      .orderBy(desc(plotPoints.id));

    const data: HydratedPlotPoint[] = res.map(({ plotPoint, ...data }) => {
      return HydratedPlotPointDtoSchema.parse({ ...plotPoint, data });
    });

    return data;
  }
}
