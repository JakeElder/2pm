import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { messageDtoToHydratedPlotPointDto } from '@2pm/utils/adapters';
import { EnvironmentService } from './environments.service';
import { AppEventEmitter } from '../event-emitter';
import { EnvironmentQueueService } from './environments.queue.service';

@Controller()
export class EnvironmentController implements OnModuleInit {
  constructor(
    @Inject('E') private readonly events: AppEventEmitter,
    private readonly service: EnvironmentService,
    private readonly queueService: EnvironmentQueueService,
  ) {}

  onModuleInit() {
    this.bindEventListeners();
  }

  bindEventListeners() {
    this.events.on('environments.joined', (e) => {
      // this.queueService.queueFor(2).add();
    });
    this.events.on('messages.created', (e) => {
      this.service.sendPlotPointCreatedEvent(
        messageDtoToHydratedPlotPointDto(e),
      );
    });
  }
}
