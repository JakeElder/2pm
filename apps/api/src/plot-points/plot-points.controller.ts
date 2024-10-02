import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PlotPointsService } from './plot-points.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { type Environment } from '@2pm/schemas';
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
  @ApiOkResponse({
    description: 'A list of plot points for the specified environment',
    type: [PlotPointDto],
  })
  findPlotPointsByEnvironment(
    @Param('id', ParseIntPipe) environmentId: Environment['id'],
  ) {
    return this.plotPointsService.findAllByEnvironment(environmentId);
  }
}
