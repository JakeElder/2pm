import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import {
  EnviromentAiTaskCompletedEventDto,
  EnviromentAiTaskUpdatedEventDto,
  PlotPointDto,
} from '@2pm/core';
import { AppEventEmitter } from '../event-emitter';
import { EnvironmentGateway } from './environments.gateway';

@Controller()
export class EnvironmentsController implements OnModuleInit {
  constructor(
    @Inject('E') private readonly events: AppEventEmitter,
    private readonly gateway: EnvironmentGateway,
  ) {}

  async onModuleInit() {
    this.events.on('plot-points.created', (e) => {
      this.handlePlotPointCreated(e);
    });

    this.events.on('environments.joined', (e) => {
      // console.log(e);
    });

    this.events.on('environment-ai-tasks.updated', (e) => {
      this.handleAiTaskUpdated(e);
    });

    this.events.on('environment-ai-tasks.completed', (e) => {
      this.handleAiTaskCompleted(e);
    });
  }

  async handlePlotPointCreated(dto: PlotPointDto) {
    this.gateway.server
      .to(`${dto.data.environment.id}`)
      .emit('plot-points.created', dto);
  }

  async handleAiTaskUpdated(dto: EnviromentAiTaskUpdatedEventDto) {
    this.gateway.server
      .to(`${dto.environmentId}`)
      .emit('ai-tasks.updated', dto);
  }

  async handleAiTaskCompleted(dto: EnviromentAiTaskCompletedEventDto) {
    this.gateway.server
      .to(`${dto.environmentId}`)
      .emit('ai-tasks.completed', dto);
  }
}
