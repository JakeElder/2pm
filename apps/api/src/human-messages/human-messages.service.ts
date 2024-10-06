import DBService from '@2pm/db';
import { CreateHumanMessageDto, HumanMessageDto } from '@2pm/data/dtos';
import {
  humanMessages,
  humanUsers,
  environments,
  messages,
  plotPointMessages,
  plotPoints,
  users,
} from '@2pm/data/schema';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NarrativeService } from '../narrative/narrative.service';

@Injectable()
export class HumanMessagesService {
  constructor(
    @Inject('DB') private readonly db: DBService,
    private readonly narrativeService: NarrativeService,
  ) {}

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
    this.narrativeService.handleHumanMessageCreated(res);
    return res;
  }
}
