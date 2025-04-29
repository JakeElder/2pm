import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { AppEventEmitter } from '../event-emitter';
import { EnvironmentGateway } from './environments.gateway';
import { PlotPointDto } from '@2pm/core';
import { type DBService } from '@2pm/core/db';

@Controller()
export class EnvironmentsController implements OnModuleInit {
  constructor(
    @Inject('E') private readonly events: AppEventEmitter,
    @Inject('DB') private readonly db: DBService,
    private readonly gateway: EnvironmentGateway,
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
