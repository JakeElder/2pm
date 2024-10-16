import { Body, Controller, Get, Inject, Post, UsePipes } from '@nestjs/common';
import { PlotPointsService } from './plot-points.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateAuthenticatedUserMessagePlotPointDto,
  AuthenticatedUserMessagePlotPointDto,
} from '@2pm/data';
import { AppEventEmitter } from '../event-emitter';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@ApiTags('Plot Points')
@Controller('plot-points/authenticated-user-message')
export class AuthenticatedUserMessagePlotPointsController {
  constructor(
    private readonly service: PlotPointsService,
    @Inject('E') private readonly events: AppEventEmitter,
  ) {}

  @Get()
  @ApiOperation({
    summary: '[Authenticated Message] Get',
    operationId: 'getAuthenticatedUserMessagePlotPoints',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Authenticaed User Message Plot Points',
    type: [AuthenticatedUserMessagePlotPointDto],
  })
  findPlotPointsByEnvironment() {
    return this.service.findAuthenticatedUserMessages();
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: '[Authenticated Message] Create',
    operationId: 'createAuthenticatedUserMessagePlotPoint',
  })
  @ApiResponse({ status: 201, type: AuthenticatedUserMessagePlotPointDto })
  async create(@Body() createDto: CreateAuthenticatedUserMessagePlotPointDto) {
    const dto = await this.service.create(createDto);
    this.events.emit('plot-points.created', dto);
    return dto;
  }
}
