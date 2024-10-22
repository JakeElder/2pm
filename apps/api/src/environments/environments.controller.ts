import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { AppEventEmitter } from '../event-emitter';
import { EnvironmentQueueService } from './environments.queue.service';
import { EnvironmentGateway } from './environments.gateway';

@Controller()
export class EnvironmentController implements OnModuleInit {
  private queue: any;
  constructor(
    @Inject('E') private readonly events: AppEventEmitter,
    // private readonly service: EnvironmentService,
    private readonly gateway: EnvironmentGateway,
    private readonly queues: EnvironmentQueueService,
  ) {}

  async onModuleInit() {
    this.bindEventListeners();
    await this.queues.init();
  }

  bindEventListeners() {
    // this.events.on('environments.joined', (e) => {});
    this.events.on('plot-points.created', (e) => {
      // this.queues.handlePlotPointCreated(e);
      this.gateway.sendPlotPointCreatedEvent(e);
    });
  }
}
