import { Body, Controller, Get, Inject, Post, UsePipes } from '@nestjs/common';
import { PlotPointsService } from './plot-points.service';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AiMessagePlotPointDto,
  CreateHumanMessagePlotPointDto,
  HumanMessagePlotPointDto,
} from '@2pm/data';
import { AppEventEmitter } from '../event-emitter';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@ApiExtraModels(HumanMessagePlotPointDto)
@ApiExtraModels(AiMessagePlotPointDto)
@ApiTags('Human Message Plot Points')
@Controller('plot-points/human-message')
export class HumanMessagePlotPointsController {
  constructor(
    private readonly service: PlotPointsService,
    @Inject('E') private readonly events: AppEventEmitter,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get',
    operationId: 'getHumanMessagePlotPoints',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Human Message Plot Points',
    type: [HumanMessagePlotPointDto],
  })
  findPlotPointsByEnvironment() {
    return this.service.findHumanMessages();
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Create',
    operationId: 'createHumanMessagePlotPoint',
  })
  @ApiResponse({ status: 201, type: HumanMessagePlotPointDto })
  async create(@Body() createDto: CreateHumanMessagePlotPointDto) {
    const dto = await this.service.create(createDto);
    this.events.emit('plot-points.created', dto);
    return dto;
  }
}
