import {
  AiUserMessageDto,
  AiUserMessageDtoSchema,
  AuthenticatedUserMessageDto,
  AuthenticatedUserMessageDtoSchema,
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
  authenticatedUserMessages,
  authenticatedUsers,
  messages,
  plotPointMessages,
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
        authenticatedUserMessage: authenticatedUserMessages,
        user: users,
        aiUser: aiUsers,
        authenticatedUser: authenticatedUsers,
        environment: environments,
      })
      .from(messages)
      .innerJoin(
        plotPointMessages,
        eq(messages.id, plotPointMessages.messageId),
      )
      .innerJoin(plotPoints, eq(plotPointMessages.plotPointId, plotPoints.id))
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(environments, eq(messages.environmentId, environments.id))
      .leftJoin(aiUserMessages, eq(messages.id, aiUserMessages.messageId))
      .leftJoin(
        authenticatedUserMessages,
        eq(messages.id, authenticatedUserMessages.messageId),
      )
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .leftJoin(authenticatedUsers, eq(users.id, authenticatedUsers.userId))
      .where(and(...filters))
      .orderBy(desc(messages.id));

    const data: MessageDto[] = res.map((row) => {
      return MessageDtoSchema.parse({ type: row.message.type, ...row });
    });

    return data;
  }

  async findAuthenticatedUser(): Promise<AuthenticatedUserMessageDto[]> {
    const res = await this.findAll({ type: 'AUTHENTICATED_USER' });
    return res.map((row) => AuthenticatedUserMessageDtoSchema.parse(row));
  }

  async findAiUser(): Promise<AiUserMessageDto[]> {
    const res = await this.findAll({ type: 'AI_USER' });
    return res.map((row) => AiUserMessageDtoSchema.parse(row));
  }

  async sendMessageUpdatedEvent(dto: MessageDto) {
    return this.gateway.sendMessageUpdated(dto);
  }
}
