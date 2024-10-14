import {
  AiUserMessageDto,
  AuthenticatedUserMessageDto,
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
import { eq, desc } from 'drizzle-orm';
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

  async findAll(): Promise<MessageDto[]> {
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
      .leftJoin(aiUserMessages, eq(messages.id, aiUserMessages.messageId))
      .leftJoin(
        authenticatedUserMessages,
        eq(messages.id, authenticatedUserMessages.messageId),
      )
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(environments, eq(messages.environmentId, environments.id))
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .leftJoin(authenticatedUsers, eq(users.id, authenticatedUsers.userId))
      .orderBy(desc(messages.id));

    const data: MessageDto[] = res.map((row) => {
      return MessageDtoSchema.parse({ type: row.message.type, ...row });
    });

    return data;
  }

  async findAuthenticatedUser(): Promise<AuthenticatedUserMessageDto[]> {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        authenticatedUserMessage: authenticatedUserMessages,
        user: users,
        authenticatedUser: authenticatedUsers,
        environment: environments,
      })
      .from(messages)
      .innerJoin(
        plotPointMessages,
        eq(messages.id, plotPointMessages.messageId),
      )
      .innerJoin(plotPoints, eq(plotPointMessages.plotPointId, plotPoints.id))
      .innerJoin(
        authenticatedUserMessages,
        eq(messages.id, authenticatedUserMessages.messageId),
      )
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(environments, eq(messages.environmentId, environments.id))
      .innerJoin(authenticatedUsers, eq(users.id, authenticatedUsers.userId))
      .where(eq(messages.type, 'AUTHENTICATED_USER'))
      .orderBy(desc(messages.id));

    const data: AuthenticatedUserMessageDto[] = res.map((row) => {
      return { type: 'AUTHENTICATED_USER', ...row };
    });

    return data;
  }

  async findAiUser(): Promise<AiUserMessageDto[]> {
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
      .innerJoin(
        plotPointMessages,
        eq(messages.id, plotPointMessages.messageId),
      )
      .innerJoin(plotPoints, eq(plotPointMessages.plotPointId, plotPoints.id))
      .innerJoin(aiUserMessages, eq(messages.id, aiUserMessages.messageId))
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(environments, eq(messages.environmentId, environments.id))
      .innerJoin(aiUsers, eq(users.id, aiUsers.userId))
      .where(eq(messages.type, 'AI_USER'))
      .orderBy(desc(messages.id));

    const data: AiUserMessageDto[] = res.map((row) => {
      const res: AiUserMessageDto = { type: 'AI_USER', ...row };
      return res;
    });

    return data;
  }

  async sendMessageUpdatedEvent(dto: MessageDto) {
    return this.gateway.sendMessageUpdated(dto);
  }
}
