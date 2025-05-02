import { Body, Controller, Inject, Post, UsePipes } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  AnonymousUserDto,
  AuthenticatedUserDto,
  CreateHumanUserDto,
} from '@2pm/core';
import { type DBService } from '@2pm/core/db';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@ApiTags('Human Users')
@Controller('human-users')
export class HumanUsersController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Create',
    operationId: 'createHumanUser',
  })
  @ApiBody({ type: CreateHumanUserDto, required: false })
  @ApiResponse({
    status: 201,
    schema: {
      oneOf: [
        { $ref: getSchemaPath(AnonymousUserDto) },
        { $ref: getSchemaPath(AuthenticatedUserDto) },
      ],
    },
  })
  async create(@Body() createDto?: CreateHumanUserDto) {
    const dto = await this.db.core.humanUsers.create(createDto);
    return dto;
  }
}
