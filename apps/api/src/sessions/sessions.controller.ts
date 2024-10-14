import {
  Controller,
  Get,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
  UsePipes,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import {
  AnonymousSessionDto,
  AuthenticatedSessionDto,
  FindSessionsQueryDto,
} from '@2pm/data';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@ApiExtraModels(AnonymousSessionDto)
@ApiExtraModels(AuthenticatedSessionDto)
@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly service: SessionsService) {}

  @Get()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Get',
    operationId: 'getSessions',
  })
  @ApiResponse({
    status: 200,
    description: 'The array of sessions',
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { $ref: getSchemaPath(AnonymousSessionDto) },
          { $ref: getSchemaPath(AuthenticatedSessionDto) },
        ],
      },
    },
  })
  @ApiQuery({
    name: 'ids',
    required: false,
    isArray: true,
    type: [String],
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  async find(
    @Query('ids', new ParseArrayPipe({ optional: true }))
    ids: FindSessionsQueryDto['ids'],
    @Query('limit', new ParseIntPipe({ optional: true }))
    limit: FindSessionsQueryDto['limit'],
  ) {
    const res = this.service.find({ ids, limit });
    return res;
  }

  // @Post()
  // @UsePipes(ZodValidationPipe)
  // @ApiOperation({
  //   summary: 'Create',
  //   operationId: 'createHumanMessagePlotPoint',
  // })
  // @ApiResponse({ status: 201, type: HumanMessagePlotPointDto })
  // async create(@Body() createDto: CreateHumanMessagePlotPointDto) {
  //   const dto = await this.service.create(createDto);
  //   this.events.emit('plot-points.created', dto);
  //   return dto;
  // }
}
