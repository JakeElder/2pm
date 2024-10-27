import { Body, Controller, Get, Inject, Post, UsePipes } from '@nestjs/common';
import { PlotPointsService } from './plot-points.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateHumanUserMessagePlotPointDto,
  HumanUserMessagePlotPointDto,
} from '@2pm/data';
import { AppEventEmitter } from '../event-emitter';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@ApiTags('Plot Points')
@Controller('plot-points/human-user-message')
export class HumanUserMessagePlotPointsController {
  constructor(
    private readonly service: PlotPointsService,
    @Inject('E') private readonly events: AppEventEmitter,
  ) {}

  @Get()
  @ApiOperation({
    summary: '[Human Message] Get',
    operationId: 'getHumanUserMessagePlotPoints',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Authenticaed User Message Plot Points',
    type: [HumanUserMessagePlotPointDto],
  })
  findPlotPointsByEnvironment() {
    return this.service.findHumanUserMessages();
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: '[Human Message] Create',
    operationId: 'createHumanUserMessagePlotPoint',
  })
  @ApiResponse({ status: 201, type: HumanUserMessagePlotPointDto })
  async create(@Body() createDto: CreateHumanUserMessagePlotPointDto) {
    const dto = await this.service.create(createDto);
    this.events.emit('plot-points.created', dto);
    return dto;
  }
}
