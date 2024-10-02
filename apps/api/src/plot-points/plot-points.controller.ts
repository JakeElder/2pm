import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PlotPointsService } from './plot-points.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlotPointDto } from './plot-point.dto';

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
  @ApiResponse({
    status: 200,
    description: 'A list of plot points for the specified environment',
    type: [PlotPointDto],
  })
  findPlotPointsByEnvironment(@Param('id', ParseIntPipe) id: number) {
    return this.plotPointsService.findAllByEnvironmentId(id);
  }
}
