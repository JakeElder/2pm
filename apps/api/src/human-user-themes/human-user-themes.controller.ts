import { type HumanUser, HumanUserThemeDtoSchema } from '@2pm/core';
import { DBService } from '@2pm/core/db';
import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';

@ApiTags('Human User Themes')
@Controller()
export class HumanUserThemesController {
  constructor(@Inject('DB') private readonly db: DBService) {}

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
    description: 'A list of users for the specified environment',
    schema: zodToOpenAPI(HumanUserThemeDtoSchema),
  })
  findAll(@Param('id', ParseUUIDPipe) humanUserId: HumanUser['id']) {
    return this.db.humanUserThemes.find(humanUserId);
  }
}
