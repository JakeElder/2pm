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
  ApiResponse,
  ApiTags,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  PLOT_POINT_TYPES,
  AiUserMessagePlotPointDto,
  FilterPlotPointsDto,
  FilterPlotPointsDtoSchema,
} from '@2pm/core';
import { DBService } from '@2pm/core/db';

@ApiExtraModels(AiUserMessagePlotPointDto)
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
  @ApiResponse({
    status: 200,
    description: 'A list of plot points for the specified environment',
    schema: {
      type: 'array',
      items: {
        oneOf: [{ $ref: getSchemaPath(AiUserMessagePlotPointDto) }],
      },
    },
  })
  findPlotPointsByEnvironment(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: FilterPlotPointsDto,
  ) {
    const q = FilterPlotPointsDtoSchema.parse(query);
    return this.db.plotPoints.findByEnvironmentId(id, q);
  }
}
