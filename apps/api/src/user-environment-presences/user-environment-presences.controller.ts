import { Body, Controller, Inject, Post, UsePipes } from '@nestjs/common';
import { type DBService } from '@2pm/core/db';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserEnvironmentPresenceDto,
  UserEnvironmentPresenceDto,
} from '@2pm/core';
import { AppEventEmitter } from '../event-emitter';

@ApiTags('User Environment Presences')
@Controller('user-environment-presences')
export class UserEnvironmentPresencesController {
  constructor(
    @Inject('E') private events: AppEventEmitter,
    @Inject('DB') private readonly db: DBService,
  ) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Create',
    operationId: 'createUserEnvironmentPresence',
  })
  @ApiBody({ type: CreateUserEnvironmentPresenceDto })
  @ApiResponse({
    status: 201,
    type: UserEnvironmentPresenceDto,
  })
  async create(@Body() createDto: CreateUserEnvironmentPresenceDto) {
    const dto = await this.db.core.userEnvironmentPresences.create(createDto);

    if (!dto) {
      return null;
    }

    if (dto.previous) {
      // this.events.emit('plot-points.created', {
      //   type: 'ENVIRONMENT_LEFT',
      //   data: dto.previous,
      // });
    }
    return dto;
  }
}
