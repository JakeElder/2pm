import { Body, Controller, Get, Inject, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AiUserMessagePlotPointDto,
  CreateAiUserMessagePlotPointDto,
} from '@2pm/data';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { AppEventEmitter } from '../event-emitter';
import DBService from '@2pm/db';

@ApiTags('Plot Points')
@Controller('plot-points/ai-message')
export class AiUserMessagePlotPointsController {
  constructor(
    @Inject('E') private readonly events: AppEventEmitter,
    @Inject('DB') private readonly db: DBService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '[Ai Message] Get',
    operationId: 'getAiUserMessagePlotPoints',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Ai Message Plot Points',
    type: [AiUserMessagePlotPointDto],
  })
  findPlotPointsByEnvironment() {
    return this.db.plotPoints.findAiUserMessages();
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: '[Ai Message] Create',
    operationId: 'createAiUserMessagePlotPoint',
  })
  @ApiResponse({ status: 201, type: AiUserMessagePlotPointDto })
  async create(@Body() createDto: CreateAiUserMessagePlotPointDto) {
    const dto = await this.db.plotPoints.insert(createDto);
    // this.events.emit('messages.created', dto);
    return dto;
  }
}
