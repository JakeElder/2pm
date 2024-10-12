import { EnvironmentsRoomJoinedEventDto } from '@2pm/data';
import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { Inject, Logger } from '@nestjs/common';
import CharacterEngine from '@2pm/character-engine';
import { EnvironmentService } from './environments.service';
import { AppEventEmitter } from '../event-emitter';
import { MessagesService } from '../messages/messages.service';

@Processor('environment')
export class EnvironmentConsumer {
  private readonly logger = new Logger(EnvironmentConsumer.name);

  constructor(
    @Inject('E') private readonly events: AppEventEmitter,
    @Inject('CE') private readonly ce: CharacterEngine,
    private readonly messageService: MessagesService,
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
    // try {
    //   const { environment } = job.data;
    //
    //   if (environment.type !== 'COMPANION_ONE_TO_ONE') {
    //     await job.moveToCompleted('No action needed');
    //     return;
    //   }
    //
    //   const count = await this.service.getEnvironmentMessageCount(
    //     environment.id,
    //   );
    //
    //   if (count !== 0) {
    //     await job.moveToCompleted('Done already');
    //     return;
    //   }
    //
    //   let content = '';
    //
    //   const dto = await this.messageService.create({
    //     type: 'AI',
    //     content,
    //     environmentId: environment.id,
    //     userId: 2,
    //   });
    //   this.events.emit('messages.created', dto);
    //
    //   const res = this.ce.greet();
    //
    //   for await (const chunk of res) {
    //     content += chunk;
    //
    //     const updated = await this.messageService.update({
    //       type: 'AI',
    //       id: dto.message.id,
    //       content,
    //     });
    //     this.events.emit('messages.updated', updated);
    //   }
    //
    //   await job.moveToCompleted('Done');
    //   return true;
    // } catch (e: any) {
    //   this.logger.error(`Failed processing job ${job.id}`, e.stack);
    //   await job.moveToFailed({ message: 'Error' });
    // }
  }
}
