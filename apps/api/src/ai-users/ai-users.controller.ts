import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AiUserDto,
  AnonymousUserDto,
  AuthenticatedUserDto,
  type Environment,
} from '@2pm/core';
import { DBService } from '@2pm/core/db';

@ApiExtraModels(AnonymousUserDto)
@ApiExtraModels(AuthenticatedUserDto)
@ApiTags('Ai Users')
@Controller()
export class AiUsersController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get('ai-users')
  @ApiOperation({
    summary: 'Get Ai Users',
    operationId: 'getAiUsers',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Ai users',
    type: [AiUserDto],
  })
  findAll() {
    return this.db.aiUsers.findAll();
  }

  @Get('environments/:id/ai-users')
  @ApiOperation({
    summary: 'Get Ai Users in an environment',
    operationId: 'getEnvironmentAiUsers',
  })
  @ApiParam({
    name: 'id',
    description: 'The Id of the environment',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Ai users',
    type: [AiUserDto],
  })
  findByEnvironmentId(
    @Param('id', ParseIntPipe) environmentId: Environment['id'],
  ) {
    return this.db.aiUsers.findAll({ environmentId });
  }
}
