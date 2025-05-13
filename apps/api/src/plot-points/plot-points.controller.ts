import {
  AiMessagePlotPointDto,
  FilterPlotPointsDto,
  FilterPlotPointsDtoSchema,
  HumanMessagePlotPointDto,
  PLOT_POINT_TYPES,
} from '@2pm/core';
import { type DBService } from '@2pm/core/db';
import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiExtraModels(AiMessagePlotPointDto)
@ApiExtraModels(HumanMessagePlotPointDto)
@ApiTags('Plot Points')
@Controller()
export class PlotPointsController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get('environments/:id/plot-points')
  @ApiOperation({
    summary: 'Get by Environment',
    operationId: 'getPlotPointsByEnvironmentId',
  })
  @ApiParam({
    name: 'id',
    description: 'The Id of the environment',
    type: Number,
  })
  @ApiQuery({
    name: 'types',
    required: false,
    description: 'Filter plot points by type',
    enum: PLOT_POINT_TYPES,
    isArray: true,
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Exclude plot points by type',
    enum: PLOT_POINT_TYPES,
    isArray: true,
  })
  @ApiQuery({
    name: 'reverse',
    required: false,
    type: Boolean,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A list of plot points for the specified environment',
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { $ref: getSchemaPath(AiMessagePlotPointDto) },
          { $ref: getSchemaPath(HumanMessagePlotPointDto) },
        ],
      },
    },
  })
  findPlotPointsByEnvironment(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: FilterPlotPointsDto,
  ) {
    const filter = FilterPlotPointsDtoSchema.parse(query);
    return this.db.app.plotPoints.findByEnvironmentId(id, filter);
  }
}
