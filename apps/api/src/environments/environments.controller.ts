import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import CharacterEngine from '@2pm/character-engine';
import {
  AiMessageCreatedEventDto,
  EnvironmentRoomJoinedEventDto,
  HumanMessageCreatedEventDto,
} from '@2pm/data';
import { EnvironmentService } from './environments.service';
import DBService from '@2pm/db';
import { AiMessagesService } from '../ai-messages/ai-messages.service';
import { AppEventEmitter } from '../event-emitter';

@Controller()
export class EnvironmentController implements OnModuleInit {
  constructor(
    @Inject('CE') private readonly ce: CharacterEngine,
    @Inject('DB') private readonly db: DBService,
    @Inject('E') private readonly e: AppEventEmitter,
    private readonly aiMessageService: AiMessagesService,
    private readonly service: EnvironmentService,
  ) {}

  onModuleInit() {
    this.e.on('environment.joined', (...args) =>
      this.handleEnvironmentRoomJoined(...args),
    );
    this.e.on('human-message.created', (...args) =>
      this.handleHumanMessageCreatedEvent(...args),
    );
    this.e.on('ai-message.created', (...args) =>
      this.handleAiMessageCreatedEvent(...args),
    );
  }

  async handleEnvironmentRoomJoined({
    user,
    environment,
  }: EnvironmentRoomJoinedEventDto) {
    // const [{ count: messageCount }] = await this.db.drizzle
    //   .select({ count: count() })
    //   .from(plotPoints)
    //   .where(
    //     and(
    //       eq(plotPoints.environmentId, environment.id),
    //       inArray(plotPoints.type, ['AI_MESSAGE', 'HUMAN_MESSAGE']),
    //     ),
    //   );
    // if (messageCount === 0) {
    //   const message = await this.aiMessageService.create({
    //     content: '',
    //     environmentId: environment.id,
    //     userId: user.id,
    //   });
    //   const res = await this.ce.greet();
    //   for await (const chunk of res) {
    //     process.stdout.write(chunk.choices[0]?.delta?.content || '');
    //   }
    // }
  }

  handleHumanMessageCreatedEvent(e: HumanMessageCreatedEventDto) {
    this.service.sendPlotPointCreated(e);

    if (e.data.environment.type === 'COMPANION_ONE_TO_ONE') {
      this.service.respondCompanionOneToOne(e.data.environment.id);
    }
  }

  handleAiMessageCreatedEvent(e: AiMessageCreatedEventDto) {
    this.service.sendPlotPointCreated(e);
  }
}
