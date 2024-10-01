import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PlotPointsService } from './plot-points.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { type Environment } from '@2pm/schemas';

@ApiTags('Plot Points')
@Controller()
export class PlotPointsController {
  constructor(private readonly plotPointsService: PlotPointsService) {}

  @Get('environments/:id/plot-points')
  @ApiOperation({
    summary: 'Get By Environment',
    operationId: 'getPlotPointsByEnvironment',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the environment',
    type: Number,
  })
  findPlotPointsByEnvironment(
    @Param('id', ParseIntPipe) environmentId: Environment['id'],
  ) {
    return this.plotPointsService.findAllByEnvironment(environmentId);
  }
}
