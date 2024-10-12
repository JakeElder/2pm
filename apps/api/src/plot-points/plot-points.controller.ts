import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  OnModuleInit,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { PlotPointsService } from './plot-points.service';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  AiPlotPointDto,
  CreateAiPlotPointDto,
  CreateHumanPlotPointDto,
  HumanPlotPointDto,
  UpdateAiPlotPointDto,
  UpdateHumanPlotPointDto,
} from '@2pm/data';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { AppEventEmitter } from '../event-emitter';

@ApiExtraModels(HumanPlotPointDto)
@ApiExtraModels(AiPlotPointDto)
@Controller('plot-points')
export class PlotPointsController implements OnModuleInit {
  constructor(
    private readonly service: PlotPointsService,
    @Inject('E') private events: AppEventEmitter,
  ) {}

  onModuleInit() {
    this.events.on('plot-points.updated', (e) =>
      this.service.sendPlotPointUpdatedEvent(e),
    );
  }

  @ApiTags('PlotPoints')
  @Get()
  @ApiOperation({
    summary: 'Get',
    operationId: 'getPlotPoints',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of plot-points',
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { $ref: getSchemaPath(HumanPlotPointDto) },
          { $ref: getSchemaPath(AiPlotPointDto) },
        ],
      },
    },
  })
  findAll() {
    return this.service.findAll();
  }

  /**
   * Human
   */
  @ApiTags('Human PlotPoints')
  @Get('/human')
  @ApiOperation({
    summary: 'Get',
    operationId: 'getHumanPlotPoints',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Human plot-points',
    type: [HumanPlotPointDto],
  })
  findHuman() {
    return this.service.findHuman();
  }

  @ApiTags('Human PlotPoints')
  @UsePipes(ZodValidationPipe)
  @Post('/human')
  @ApiOperation({ summary: 'Create', operationId: 'createHumanPlotPoint' })
  @ApiResponse({ status: 201, type: HumanPlotPointDto })
  async create(@Body() createDto: CreateHumanPlotPointDto) {
    const dto = await this.service.create(createDto);
    this.events.emit('plot-points.created', dto);
    return dto;
  }

  @ApiTags('Human PlotPoints')
  @UsePipes(ZodValidationPipe)
  @Patch('/human')
  @ApiOperation({ summary: 'Update', operationId: 'updateHumanPlotPoint' })
  @ApiResponse({ status: 200, type: HumanPlotPointDto })
  async updateHuman(@Body() updateDto: UpdateHumanPlotPointDto) {
    const res = await this.service.update(updateDto);
    this.events.emit('plot-points.updated', res);
    return res;
  }

  /**
   * Ai
   */
  @ApiTags('Ai PlotPoints')
  @Get('/ai')
  @ApiOperation({
    summary: 'Get',
    operationId: 'getAiPlotPoints',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Ai plot-points',
    type: [AiPlotPointDto],
  })
  findAi() {
    return this.service.findAi();
  }

  @ApiTags('Ai PlotPoints')
  @UsePipes(ZodValidationPipe)
  @Post('/ai')
  @ApiOperation({ summary: 'Create', operationId: 'createAiPlotPoint' })
  @ApiResponse({ status: 201, type: AiPlotPointDto })
  async createAi(@Body() createDto: CreateAiPlotPointDto) {
    const dto = await this.service.create(createDto);
    this.events.emit('plot-points.created', dto);
    return dto;
  }

  @ApiTags('Ai PlotPoints')
  @UsePipes(ZodValidationPipe)
  @Patch('/ai')
  @ApiOperation({ summary: 'Update', operationId: 'updateAiPlotPoint' })
  @ApiResponse({ status: 200, type: AiPlotPointDto })
  async updateAi(@Body() updateDto: UpdateAiPlotPointDto) {
    const res = await this.service.update(updateDto);
    this.events.emit('plot-points.updated', res);
    return res;
  }
}
