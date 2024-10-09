import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { EnvironmentsRoomJoinedEventDto } from '@2pm/data';
import { EnvironmentService } from './environments.service';
import { AppEventEmitter } from '../event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { type Queue } from 'bull';

@Controller()
export class EnvironmentController implements OnModuleInit {
  constructor(
    @Inject('E') private readonly events: AppEventEmitter,
    @InjectQueue('environment')
    private readonly queue: Queue<EnvironmentsRoomJoinedEventDto>,
    private readonly service: EnvironmentService,
  ) {}

  onModuleInit() {
    this.events.on('environment.joined', (e) => {
      this.queue.add('processJoined', e);
    });
    this.events.on('human-message.created', (e) => {
      this.service.sendPlotPointCreatedEvent(e);
    });
    this.events.on('ai-message.created', (e) =>
      this.service.sendPlotPointCreatedEvent(e),
    );
  }
}
