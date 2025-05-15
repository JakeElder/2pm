import {
  type HumanUser,
  type HumanUserTheme,
  HumanUserThemeDtoSchema,
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
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { HumanUserThemesGateway } from './human-user-themes.gateway';

@ApiTags('Human User Themes')
@Controller()
export class HumanUserThemesController {
  constructor(
    @Inject('DB') private readonly db: DBService,
    private readonly gateway: HumanUserThemesGateway,
  ) {}

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
  @ApiResponse({
    status: 201,
    schema: zodToOpenAPI(HumanUserThemeDtoSchema),
  })
  async prev(@Param('id', ParseIntPipe) id: HumanUserTheme['id']) {
    const dto = await this.db.humanUserThemes.prev(id);
    this.gateway.server.to(`${dto.id}`).emit('updated', dto);
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
  @ApiResponse({
    status: 201,
    schema: zodToOpenAPI(HumanUserThemeDtoSchema),
  })
  async next(@Param('id', ParseIntPipe) id: HumanUserTheme['id']) {
    const dto = await this.db.humanUserThemes.next(id);
    this.gateway.server.to(`${dto.id}`).emit('updated', dto);
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
