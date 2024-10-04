import DBService from '@2pm/db';
import { CreateHumanMessageDto, HumanMessageDto } from '@2pm/schemas/dto';
import {
  humanMessages,
  humanUsers,
  environments,
  messages,
  plotPointMessages,
  plotPoints,
  users,
} from '@2pm/schemas/drizzle';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class HumanMessagesService {
  constructor(@Inject('DB') private readonly db: DBService) {}

  async getByPlotPointId(plotPointId: number): Promise<HumanMessageDto> {
    const result = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        humanMessage: humanMessages,
        user: users,
        humanUser: humanUsers,
        environment: environments,
      })
      .from(plotPoints)
      .innerJoin(
        plotPointMessages,
        eq(plotPoints.id, plotPointMessages.plotPointId),
      )
      .innerJoin(messages, eq(plotPointMessages.messageId, messages.id))
      .innerJoin(humanMessages, eq(messages.id, humanMessages.messageId))
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(humanUsers, eq(users.id, humanUsers.userId))
      .innerJoin(environments, eq(messages.environmentId, environments.id))
      .where(eq(plotPoints.id, plotPointId))
      .limit(1);

    if (result.length === 0) {
      null;
    }

    return result[0];
  }

  async create({ userId, environmentId, content }: CreateHumanMessageDto) {
    const res = await this.db.humanMessages.insert({
      userId,
      environmentId,
      content,
    });
    return res;
  }
}
