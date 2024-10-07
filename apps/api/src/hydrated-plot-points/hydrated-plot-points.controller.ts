import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { HydratedPlotPointsService } from './hydrated-plot-points.service';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  AiMessageHydratedPlotPointDto,
  EnvironmentEnteredHydratedPlotPointDto,
  EnvironmentLeftHydratedPlotPointDto,
  HumanMessageHydratedPlotPointDto,
} from '@2pm/data/dtos';

@ApiExtraModels(HumanMessageHydratedPlotPointDto)
@ApiExtraModels(AiMessageHydratedPlotPointDto)
@ApiExtraModels(EnvironmentEnteredHydratedPlotPointDto)
@ApiExtraModels(EnvironmentLeftHydratedPlotPointDto)
@ApiTags('Hydrated Plot Points')
@Controller()
export class HydratedPlotPointsController {
  constructor(private readonly service: HydratedPlotPointsService) {}
  @Get('environments/:id/hydrated-plot-points')
  @ApiOperation({
    summary: 'Get By Environment',
    operationId: 'getHydratedPlotPointsByEnvironmentId',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the environment',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A list of hydrated plot points for the specified environment',
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { $ref: getSchemaPath(HumanMessageHydratedPlotPointDto) },
          { $ref: getSchemaPath(AiMessageHydratedPlotPointDto) },
          { $ref: getSchemaPath(EnvironmentEnteredHydratedPlotPointDto) },
          { $ref: getSchemaPath(EnvironmentLeftHydratedPlotPointDto) },
        ],
      },
    },
  })
  findPlotPointsByEnvironment(@Param('id', ParseIntPipe) id: number) {
    return this.service.findAllByEnvironmentId(id);
  }
}
