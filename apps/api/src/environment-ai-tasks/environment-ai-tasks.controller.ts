import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { AppEventEmitter } from '../event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { type Queue } from 'bull';
import { ActiveEnvironmentAiTaskDto, PlotPointDto } from '@2pm/core';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { type DBService } from '@2pm/core/db';
import { EnvironmentAiTasksGateway } from './environment-ai-tasks.gateway';

@ApiExtraModels(ActiveEnvironmentAiTaskDto)
@ApiTags('Evironment Ai Tasks')
@Controller()
export class EnvironmentAiTasksController {
  constructor(
    @Inject('DB') private readonly db: DBService,
    @Inject('E') private readonly events: AppEventEmitter,
    @InjectQueue('environment-ai-tasks')
    private readonly queue: Queue<{ trigger: PlotPointDto }>,
    private readonly gateway: EnvironmentAiTasksGateway,
  ) {}

  async onModuleInit() {
    this.events.on('environment-ai-tasks.updated', (e) => {
      this.gateway.server.to(`${e.environmentId}`).emit('updated', e);
    });

    this.events.on('environment-ai-tasks.completed', (e) => {
      this.gateway.server.to(`${e.environmentId}`).emit('completed', e);
    });

    this.events.on('plot-points.created', (e) => {
      this.handlePlotPointCreated(e);
    });

    // this.queue.on('completed', (job: Job<{ trigger: PlotPointDto }>) => {
    //   console.log(job);
    // });
  }

  async handlePlotPointCreated(dto: PlotPointDto) {
    if (dto.type === 'HUMAN_MESSAGE') {
      this.queue.add({ trigger: dto });
    }
  }

  @Get('environments/:id/ai-task')
  @ApiOperation({
    summary: 'Gets the current Ai task',
    operationId: 'getEnvironmentAiTask',
  })
  @ApiParam({
    name: 'id',
    description: 'The Id of the environment',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    schema: {
      oneOf: [
        { $ref: getSchemaPath(ActiveEnvironmentAiTaskDto) },
        { type: 'null' },
      ],
    },
  })
  findByEnvironmentId(@Param('id', ParseIntPipe) id: number) {
    return this.db.core.environmentAiTasks.findByEnvironmentId(id);
  }
}
