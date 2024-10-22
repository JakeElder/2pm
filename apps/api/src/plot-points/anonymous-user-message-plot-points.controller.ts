import { Body, Controller, Get, Inject, Post, UsePipes } from '@nestjs/common';
import { PlotPointsService } from './plot-points.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateAnonymousUserMessagePlotPointDto,
  AnonymousUserMessagePlotPointDto,
} from '@2pm/data';
import { AppEventEmitter } from '../event-emitter';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@ApiTags('Plot Points')
@Controller('plot-points/anonymous-user-message')
export class AnonymousUserMessagePlotPointsController {
  constructor(
    private readonly service: PlotPointsService,
    @Inject('E') private readonly events: AppEventEmitter,
  ) {}

  @Get()
  @ApiOperation({
    summary: '[Anonymous Message] Get',
    operationId: 'getAnonymousUserMessagePlotPoints',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Authenticaed User Message Plot Points',
    type: [AnonymousUserMessagePlotPointDto],
  })
  findPlotPointsByEnvironment() {
    return this.service.findAnonymousUserMessages();
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: '[Anonymous Message] Create',
    operationId: 'createAnonymousUserMessagePlotPoint',
  })
  @ApiResponse({ status: 201, type: AnonymousUserMessagePlotPointDto })
  async create(@Body() createDto: CreateAnonymousUserMessagePlotPointDto) {
    const dto = await this.service.create(createDto);
    this.events.emit('plot-points.created', dto);
    return dto;
  }
}
