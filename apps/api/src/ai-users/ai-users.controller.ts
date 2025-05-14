import { Controller, Get, Inject } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AiUserDto, AnonymousUserDto, AuthenticatedUserDto } from '@2pm/core';
import { DBService } from '@2pm/core/db';

@ApiExtraModels(AnonymousUserDto)
@ApiExtraModels(AuthenticatedUserDto)
@ApiTags('Ai Users')
@Controller('ai-users')
export class AiUsersController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get()
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
}
