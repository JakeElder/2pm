import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { EnvironmentService } from './environments.service';
import { AppEventEmitter } from '../event-emitter';
import { EnvironmentQueueService } from './environments.queue.service';
import { EnvironmentGateway } from './environments.gateway';

@Controller()
export class EnvironmentController implements OnModuleInit {
  constructor(
    @Inject('E') private readonly events: AppEventEmitter,
    private readonly service: EnvironmentService,
    private readonly gateway: EnvironmentGateway,
    private readonly queueService: EnvironmentQueueService,
  ) {}

  onModuleInit() {
    this.bindEventListeners();
  }

  bindEventListeners() {
    this.events.on('environments.joined', (e) => {
      // this.queueService.queueFor(2).add();
    });
    this.events.on('plot-points.created', (e) => {
      this.gateway.sendPlotPointCreatedEvent(e);
    });
  }
}
