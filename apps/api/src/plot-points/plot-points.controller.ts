import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlotPointDto } from '@2pm/schemas/dto';
import { PlotPointsService } from './plot-points.service';

@ApiTags('Plot Points')
@Controller()
export class PlotPointsController {
  constructor(private readonly service: PlotPointsService) {}

  @Get('environments/:id/plot-points')
  @ApiOperation({
    summary: 'Get By Environment',
    operationId: 'getPlotPointsByEnvironmentId',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the environment',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A list of plot points for the specified environment',
    type: [PlotPointDto],
  })
  findPlotPointsByEnvironment(@Param('id', ParseIntPipe) id: number) {
    return this.service.findAllByEnvironmentId(id);
  }
}
