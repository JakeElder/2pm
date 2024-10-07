import { Controller, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import CharacterEngine from '@2pm/character-engine';
import {
  AiMessageCreatedEvent,
  EnvironmentRoomJoinedEvent,
  HumanMessageCreatedEvent,
} from '@2pm/data/events';
import { EnvironmentService } from './environments.service';
import DBService from '@2pm/db';
import { plotPoints } from '@2pm/data/schema';
import { eq, and, inArray, count } from 'drizzle-orm';
import { AiMessagesService } from 'src/ai-messages/ai-messages.service';

@Controller()
export class EnvironmentController {
  constructor(
    @Inject('CE') private readonly ce: CharacterEngine,
    @Inject('DB') private readonly db: DBService,
    private readonly aiMessageService: AiMessagesService,
    private readonly service: EnvironmentService,
  ) {}

  @OnEvent('environment.joined')
  async handleEnvironmentJoined({
    user,
    environment,
  }: EnvironmentRoomJoinedEvent) {
    const [{ count: messageCount }] = await this.db.drizzle
      .select({ count: count() })
      .from(plotPoints)
      .where(
        and(
          eq(plotPoints.environmentId, environment.id),
          inArray(plotPoints.type, ['AI_MESSAGE', 'HUMAN_MESSAGE']),
        ),
      );
    if (messageCount === 0) {
      const message = await this.aiMessageService.create({
        content: '',
        environmentId: environment.id,
        userId: user.id,
      });
      const res = await this.ce.greet();
      for await (const chunk of res) {
        process.stdout.write(chunk.choices[0]?.delta?.content || '');
      }
    }
  }

  @OnEvent('human-message.created')
  handleHumanMessageCreatedEvent(e: HumanMessageCreatedEvent) {
    this.service.sendPlotPointCreated(e);

    if (e.data.environment.type === 'COMPANION_ONE_TO_ONE') {
      this.service.respondCompanionOneToOne(e.data.environment.id);
    }
  }

  @OnEvent('ai-message.created')
  handleAiMessageCreatedEvent(e: AiMessageCreatedEvent) {
    this.service.sendPlotPointCreated(e);
  }
}
