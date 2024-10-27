import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PlotPointsService } from './plot-points.service';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AiUserMessagePlotPointDto } from '@2pm/data';

@ApiExtraModels(AiUserMessagePlotPointDto)
@ApiTags('Plot Points')
@Controller()
export class PlotPointsController {
  constructor(private readonly service: PlotPointsService) {}
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
    return this.service.findAllByEnvironmentId(id);
  }
}
