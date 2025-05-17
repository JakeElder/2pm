import {
  type HumanUser,
  type HumanUserTheme,
  HumanUserThemeDtoSchema,
  ShiftDirectionHumanUserThemeDto,
} from '@2pm/core';
import { DBService } from '@2pm/core/db';
import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { HumanUserThemesGateway } from './human-user-themes.gateway';
import { AppEventEmitter } from '../event-emitter';

@ApiTags('Human User Themes')
@Controller()
export class HumanUserThemesController {
  constructor(
    @Inject('E') protected readonly events: AppEventEmitter,
    @Inject('DB') private readonly db: DBService,
    private readonly gateway: HumanUserThemesGateway,
  ) {}

  async onModuleInit() {
    this.events.on('plot-points.created', ({ type, data }) => {
      if (type === 'USER_THEME_SWITCHED') {
        this.gateway.server
          .to(`${data.humanUserTheme.id}`)
          .emit('updated', { type, data });
      }
    });
  }

  @Post('human-user-themes/:id/prev')
  @ApiOperation({
    summary: 'Prev',
    operationId: 'prevHumanUserTheme',
  })
  @ApiParam({
    name: 'id',
    description: 'The Id of the human user theme',
    type: Number,
  })
  @ApiQuery({
    name: 'environmentId',
    description: 'The Id of the environment changed from',
    type: Number,
  })
  @ApiResponse({
    status: 201,
    schema: zodToOpenAPI(HumanUserThemeDtoSchema),
  })
  async prev(
    @Param('id', ParseIntPipe) id: HumanUserTheme['id'],
    @Query() { environmentId }: Omit<ShiftDirectionHumanUserThemeDto, 'id'>,
  ) {
    const dto = await this.db.humanUserThemes.prev({ id, environmentId });
    this.events.emit('plot-points.created', dto);
    return dto;
  }

  @Post('human-user-themes/:id/next')
  @ApiOperation({
    summary: 'Next',
    operationId: 'nextHumanUserTheme',
  })
  @ApiParam({
    name: 'id',
    description: 'The Id of the human user theme',
    type: Number,
  })
  @ApiQuery({
    name: 'environmentId',
    description: 'The Id of the environment changed from',
    type: Number,
  })
  @ApiResponse({
    status: 201,
    schema: zodToOpenAPI(HumanUserThemeDtoSchema),
  })
  async next(
    @Param('id', ParseIntPipe) id: HumanUserTheme['id'],
    @Query() { environmentId }: Omit<ShiftDirectionHumanUserThemeDto, 'id'>,
  ) {
    const dto = await this.db.humanUserThemes.next({ id, environmentId });
    this.events.emit('plot-points.created', dto);
    return dto;
  }

  @Get('human-users/:id/theme')
  @ApiOperation({
    summary: 'Get by Human User',
    operationId: 'getHumanUserTheme',
  })
  @ApiParam({
    name: 'id',
    description: 'The Id of the human user',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The human user theme',
    schema: zodToOpenAPI(HumanUserThemeDtoSchema),
  })
  findAll(@Param('id', ParseUUIDPipe) humanUserId: HumanUser['id']) {
    return this.db.humanUserThemes.findByHumanUserId(humanUserId);
  }
}
