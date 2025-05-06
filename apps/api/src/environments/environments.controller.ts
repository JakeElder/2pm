import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { Job, type Queue } from 'bull';
import { PlotPointDto } from '@2pm/core';
import { InjectQueue } from '@nestjs/bull';
import { AppEventEmitter } from '../event-emitter';
import { EnvironmentGateway } from './environments.gateway';

@Controller()
export class EnvironmentsController implements OnModuleInit {
  constructor(
    @Inject('E') private readonly events: AppEventEmitter,
    @InjectQueue('environments')
    private readonly queue: Queue<{ trigger: PlotPointDto }>,
    private readonly gateway: EnvironmentGateway,
  ) {}

  async onModuleInit() {
    this.events.on('plot-points.created', (e) => {
      this.handlePlotPointCreated(e);
    });

    this.events.on('environments.joined', (e) => {
      // console.log(e);
    });

    this.queue.on('completed', (job: Job<{ trigger: PlotPointDto }>) => {});
  }

  async handlePlotPointCreated(dto: PlotPointDto) {
    this.gateway.server
      .to(`${dto.data.environment.id}`)
      .emit('plot-points.created', dto);

    if (dto.type === 'HUMAN_MESSAGE') {
      this.queue.add({ trigger: dto });
    }
  }
}
