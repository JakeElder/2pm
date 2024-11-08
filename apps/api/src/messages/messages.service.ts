import {
  AiUserMessageDto,
  AiUserMessageDtoSchema,
  FindMessagesQueryDto,
  InferMessageDto,
  MessageDto,
  MessageDtoSchema,
  UpdateMessageDto,
} from '@2pm/data';
import {
  aiUserMessages,
  aiUsers,
  environments,
  messages,
  plotPoints,
  users,
} from '@2pm/data/schema';
import DBService from '@2pm/db';
import { Inject, Injectable } from '@nestjs/common';
import { eq, desc, and, SQL } from 'drizzle-orm';
import { MessagesGateway } from './messages.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('DB') private readonly db: DBService,
    private readonly gateway: MessagesGateway,
  ) {}
  public async update<T extends UpdateMessageDto>(
    dto: T,
  ): Promise<InferMessageDto<T>> {
    return this.db.messages.update(dto);
  }

  async findAll({ type }: FindMessagesQueryDto): Promise<MessageDto[]> {
    const filters: SQL[] = [];

    if (type) {
      filters.push(eq(messages.type, type));
    }

    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        aiUserMessage: aiUserMessages,
        user: users,
        aiUser: aiUsers,
        environment: environments,
      })
      .from(messages)
      .innerJoin(plotPoints, eq(messages.plotPointId, plotPoints.id))
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(environments, eq(messages.environmentId, environments.id))
      .leftJoin(aiUserMessages, eq(messages.id, aiUserMessages.messageId))
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .where(and(...filters))
      .orderBy(desc(messages.id));

    const data: MessageDto[] = res.map((row) => {
      return MessageDtoSchema.parse({ type: row.message.type, ...row });
    });

    return data;
  }

  async findAiUser(): Promise<AiUserMessageDto[]> {
    const res = await this.findAll({ type: 'AI_USER' });
    return res.map((row) => AiUserMessageDtoSchema.parse(row));
  }

  async sendMessageUpdatedEvent(dto: MessageDto) {
    return this.gateway.sendMessageUpdated(dto);
  }
}
