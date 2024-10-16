import { Body, Controller, Get, Inject, Post, UsePipes } from '@nestjs/common';
import { PlotPointsService } from './plot-points.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AiUserMessagePlotPointDto,
  CreateAiUserMessagePlotPointDto,
} from '@2pm/data';
import { AppEventEmitter } from '../event-emitter';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@ApiTags('Plot Points')
@Controller('plot-points/ai-message')
export class AiUserMessagePlotPointsController {
  constructor(
    private readonly service: PlotPointsService,
    @Inject('E') private readonly events: AppEventEmitter,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get Ai Message Plot Points',
    operationId: 'getAiUserMessagePlotPoints',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Ai Message Plot Points',
    type: [AiUserMessagePlotPointDto],
  })
  findPlotPointsByEnvironment() {
    return this.service.findAiUserMessages();
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Create Ai Message Plot Point',
    operationId: 'createAiUserMessagePlotPoint',
  })
  @ApiResponse({ status: 201, type: AiUserMessagePlotPointDto })
  async create(@Body() createDto: CreateAiUserMessagePlotPointDto) {
    const dto = await this.service.create(createDto);
    // this.events.emit('messages.created', dto);
    return dto;
  }
}
