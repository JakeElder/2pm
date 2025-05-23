import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  AiUserDto,
  AnonymousUserDto,
  AuthenticatedUserDto,
  HumanUserTagUpdatedPlotPointDto,
  HumanUserTagUpdatedPlotPointDtoSchema,
  UpdateHumanUserTagDto,
} from '@2pm/core';
import { DBService } from '@2pm/core/db';
import { zodToOpenAPI, ZodValidationPipe } from 'nestjs-zod';

@ApiExtraModels(AiUserDto)
@ApiExtraModels(AnonymousUserDto)
@ApiExtraModels(AuthenticatedUserDto)
@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get('environments/:id/users')
  @ApiOperation({
    summary: 'Get by Environment',
    operationId: 'getUsersByEnvironmentId',
  })
  @ApiParam({
    name: 'id',
    description: 'The Id of the environment',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A list of users for the specified environment',
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { $ref: getSchemaPath(AiUserDto) },
          { $ref: getSchemaPath(AnonymousUserDto) },
          { $ref: getSchemaPath(AuthenticatedUserDto) },
        ],
      },
    },
  })
  findAll(@Param('id', ParseIntPipe) id: number) {
    return this.db.users.findByEnvironmentId(id);
  }
}
