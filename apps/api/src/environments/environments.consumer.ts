import { EnvironmentsRoomJoinedEventDto } from '@2pm/data';
import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { Inject, Logger } from '@nestjs/common';
import CharacterEngine from '@2pm/character-engine';
import { AiMessagesService } from '../ai-messages/ai-messages.service';
import { EnvironmentService } from './environments.service';
import { AppEventEmitter } from '../event-emitter';

@Processor('environment')
export class EnvironmentConsumer {
  private readonly logger = new Logger(EnvironmentConsumer.name);

  constructor(
    @Inject('E') private readonly events: AppEventEmitter,
    @Inject('CE') private readonly ce: CharacterEngine,
    private readonly aiMessageService: AiMessagesService,
    private readonly service: EnvironmentService,
  ) {}

  @OnQueueFailed()
  async onJobFailed(job: Job, error: Error) {
    this.logger.error(
      `Job failed: ${job.id} with error: ${error.message}`,
      error.stack,
    );
  }

  @Process('processJoined')
  async processJoined(job: Job<EnvironmentsRoomJoinedEventDto>) {
    const { environment } = job.data;

    if (environment.type !== 'COMPANION_ONE_TO_ONE') {
      await job.moveToCompleted();
      return;
    }

    const count = await this.service.getEnvironmentMessageCount(environment.id);

    if (count !== 0) {
      await job.moveToCompleted();
      return;
    }

    let content = '';

    const message = await this.aiMessageService.create({
      content,
      environmentId: environment.id,
      userId: 2,
    });
    this.events.emit('ai-message.created', message);

    const res = this.ce.greet();

    for await (const chunk of res) {
      content += chunk;

      const updated = await this.aiMessageService.update({
        aiMessageId: message.data.aiMessage.id,
        content,
      });
      this.events.emit('ai-message.updated', updated);
    }
  }
}
