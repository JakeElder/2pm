import DBService from '@2pm/db';
import {
  CreateHumanMessageDto,
  HumanMessageHydratedPlotPointDto,
} from '@2pm/data';
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

    return res;
  }
}
