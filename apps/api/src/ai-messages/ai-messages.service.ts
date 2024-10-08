import DBService from '@2pm/db';
import { AiMessageHydratedPlotPointDto, CreateAiMessageDto } from '@2pm/data';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AiMessagesService {
  constructor(@Inject('DB') private readonly db: DBService) {}

  async create({
    userId,
    environmentId,
    content,
  }: CreateAiMessageDto): Promise<AiMessageHydratedPlotPointDto> {
    const res = await this.db.aiMessages.insert({
      userId,
      environmentId,
      content,
    });

    return res;
  }
}
