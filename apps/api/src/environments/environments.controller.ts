import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { PlotPointDto } from '@2pm/core';
import { AppEventEmitter } from '../event-emitter';
import { EnvironmentsGateway } from './environments.gateway';

@Controller()
export class EnvironmentsController implements OnModuleInit {
  constructor(
    @Inject('E') private readonly events: AppEventEmitter,
    private readonly gateway: EnvironmentsGateway,
  ) {}

  async onModuleInit() {
    this.events.on('plot-points.created', (e) => {
      this.handlePlotPointCreated(e);
    });

    this.events.on('environments.joined', (e) => {
      // console.log(e);
    });
  }

  async handlePlotPointCreated(dto: PlotPointDto) {
    this.gateway.server
      .to(`${dto.data.environment.id}`)
      .emit('plot-points.created', dto);
  }
}
