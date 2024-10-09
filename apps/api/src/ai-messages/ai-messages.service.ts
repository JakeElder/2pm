import DBService from '@2pm/db';
import {
  AiMessageDto,
  AiMessageHydratedPlotPointDto,
  CreateAiMessageDto,
  UpdateAiMessageDto,
} from '@2pm/data';
import { Inject, Injectable } from '@nestjs/common';
import { AiMessagesGateway } from './ai-messages.gateway';

@Injectable()
export class AiMessagesService {
  constructor(
    @Inject('DB') private readonly db: DBService,
    private readonly gateway: AiMessagesGateway,
  ) {}

  async create(
    dto: CreateAiMessageDto,
  ): Promise<AiMessageHydratedPlotPointDto> {
    return this.db.aiMessages.insert(dto);
  }

  async update(dto: UpdateAiMessageDto): Promise<AiMessageDto> {
    return this.db.aiMessages.update(dto);
  }

  async sendAiMessageUpdatedEvent(dto: AiMessageDto) {
    return this.gateway.sendAiMessageUpdated(dto);
  }
}
