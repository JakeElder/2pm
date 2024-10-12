import {
  AiMessageDto,
  CreateMessageDto,
  HumanMessageDto,
  InferMessageDto,
  MessageDto,
  MessageDtoSchema,
  UpdateMessageDto,
} from '@2pm/data';
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
import { eq, desc } from 'drizzle-orm';
import { MessagesGateway } from './messages.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('DB') private readonly db: DBService,
    private readonly gateway: MessagesGateway,
  ) {}

  public async create<T extends CreateMessageDto>(
    dto: T,
  ): Promise<InferMessageDto<T>> {
    return this.db.messages.insert(dto);
  }

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
        aiMessage: aiMessages,
        humanMessage: humanMessages,
        user: users,
        aiUser: aiUsers,
        humanUser: humanUsers,
        environment: environments,
      })
      .from(messages)
      .innerJoin(
        plotPointMessages,
        eq(messages.id, plotPointMessages.messageId),
      )
      .innerJoin(plotPoints, eq(plotPointMessages.plotPointId, plotPoints.id))
      .leftJoin(aiMessages, eq(messages.id, aiMessages.messageId))
      .leftJoin(humanMessages, eq(messages.id, humanMessages.messageId))
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(environments, eq(messages.environmentId, environments.id))
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId))
      .orderBy(desc(messages.id));

    const data: MessageDto[] = res.map((row) => {
      return MessageDtoSchema.parse({ type: row.message.type, ...row });
    });

    return data;
  }

  async findHuman(): Promise<HumanMessageDto[]> {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        humanMessage: humanMessages,
        user: users,
        humanUser: humanUsers,
        environment: environments,
      })
      .from(messages)
      .innerJoin(
        plotPointMessages,
        eq(messages.id, plotPointMessages.messageId),
      )
      .innerJoin(plotPoints, eq(plotPointMessages.plotPointId, plotPoints.id))
      .innerJoin(humanMessages, eq(messages.id, humanMessages.messageId))
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(environments, eq(messages.environmentId, environments.id))
      .innerJoin(humanUsers, eq(users.id, humanUsers.userId))
      .where(eq(messages.type, 'HUMAN'))
      .orderBy(desc(messages.id));

    const data: HumanMessageDto[] = res.map((row) => {
      return { type: 'HUMAN', ...row };
    });

    return data;
  }

  async findAi(): Promise<AiMessageDto[]> {
    const res = await this.db.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        aiMessage: aiMessages,
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
      .innerJoin(aiMessages, eq(messages.id, aiMessages.messageId))
      .innerJoin(users, eq(messages.userId, users.id))
      .innerJoin(environments, eq(messages.environmentId, environments.id))
      .innerJoin(aiUsers, eq(users.id, aiUsers.userId))
      .where(eq(messages.type, 'AI'))
      .orderBy(desc(messages.id));

    const data: AiMessageDto[] = res.map((row) => {
      return { type: 'AI', ...row };
    });

    return data;
  }

  async sendMessageUpdatedEvent(dto: MessageDto) {
    return this.gateway.sendMessageUpdated(dto);
  }
}
