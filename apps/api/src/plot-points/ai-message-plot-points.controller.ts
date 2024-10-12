import { Body, Controller, Get, Inject, Post, UsePipes } from '@nestjs/common';
import { PlotPointsService } from './plot-points.service';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AiMessagePlotPointDto, CreateAiMessagePlotPointDto } from '@2pm/data';
import { AppEventEmitter } from '../event-emitter';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@ApiExtraModels(AiMessagePlotPointDto)
@ApiExtraModels(AiMessagePlotPointDto)
@ApiTags('Ai Message Plot Points')
@Controller('plot-points/ai-message')
export class AiMessagePlotPointsController {
  constructor(
    private readonly service: PlotPointsService,
    @Inject('E') private readonly events: AppEventEmitter,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get',
    operationId: 'getAiMessagePlotPoints',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Ai Message Plot Points',
    type: [AiMessagePlotPointDto],
  })
  findPlotPointsByEnvironment() {
    return this.service.findAiMessages();
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Create',
    operationId: 'createAiMessagePlotPoint',
  })
  @ApiResponse({ status: 201, type: AiMessagePlotPointDto })
  async create(@Body() createDto: CreateAiMessagePlotPointDto) {
    const dto = await this.service.create(createDto);
    // this.events.emit('messages.created', dto);
    return dto;
  }
}
