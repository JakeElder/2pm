import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AiUserMessagePlotPointDto } from '@2pm/core';
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
  @ApiResponse({
    status: 200,
    description: 'A list of  plot points for the specified environment',
    schema: {
      type: 'array',
      items: {
        oneOf: [{ $ref: getSchemaPath(AiUserMessagePlotPointDto) }],
      },
    },
  })
  findPlotPointsByEnvironment(@Param('id', ParseIntPipe) id: number) {
    return this.db.plotPoints.findAllByEnvironmentId(id);
  }
}
