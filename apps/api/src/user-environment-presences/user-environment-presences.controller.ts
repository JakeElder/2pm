import { Body, Controller, Inject, Post, UsePipes } from '@nestjs/common';
import { DBService } from '@2pm/core/db';
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
    const dto = await this.db.userEnvironmentPresences.create(createDto);

    if (!dto) {
      return null;
    }

    this.events.emit('user-environment-presences.created', dto);

    return dto;
  }
}
