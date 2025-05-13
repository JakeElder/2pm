import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { AppEventEmitter } from '../event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { type Queue } from 'bull';
import {
  ActiveEnvironmentAiTaskDto,
  AI_USER_CODES,
  type AiResponseJob,
  PlotPointDto,
} from '@2pm/core';
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
import traverse from 'traverse';

@ApiExtraModels(ActiveEnvironmentAiTaskDto)
@ApiTags('Evironment Ai Tasks')
@Controller()
export class EnvironmentAiTasksController {
  constructor(
    @Inject('DB') private readonly db: DBService,
    @Inject('E') private readonly events: AppEventEmitter,
    @InjectQueue('environment-ai-tasks')
    private readonly queue: Queue<AiResponseJob['data']>,
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
      const tree = traverse(dto.data.humanMessage.json);

      const mentions = tree.reduce(function (acc, node) {
        return node.type === 'mention' ? [...acc, node] : acc;
      }, []);

      if (mentions.length && AI_USER_CODES.includes(mentions[0].attrs.id)) {
        this.queue.add({
          message: dto.data,
          aiUserId: mentions[0].attrs.id,
        });
      }
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
    return this.db.app.environmentAiTasks.findByEnvironmentId(id);
  }
}
