import DBService from '@2pm/db';
import {
  CreateHumanMessageDto,
  HumanMessageHydratedPlotPointDto,
} from '@2pm/data/dtos';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class HumanMessagesService {
  constructor(@Inject('DB') private readonly db: DBService) {}

  async create({
    userId,
    environmentId,
    content,
  }: CreateHumanMessageDto): Promise<HumanMessageHydratedPlotPointDto> {
    const res = await this.db.humanMessages.insert({
      userId,
      environmentId,
      content,
    });

    return {
      type: 'HUMAN_MESSAGE',
      id: res.plotPoint.id,
      environmentId: res.plotPoint.environmentId,
      data: {
        message: res.message,
        user: res.user,
        humanUser: res.humanUser,
        environment: res.environment,
        humanMessage: res.humanMessage,
      },
    };
  }
}
