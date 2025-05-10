import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { type DBService } from '@2pm/core/db';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnvironmentUserListDtoSchema } from '@2pm/core';
import { zodToOpenAPI } from 'nestjs-zod';
import { AppEventEmitter } from '../event-emitter';
import { EnvironmentUserListsGateway } from './environment-user-lists.gateway';

@ApiTags('Environment User Lists')
@Controller()
export class EnvironmentUserListsController {
  constructor(
    @Inject('DB') private readonly db: DBService,
    @Inject('E') private readonly events: AppEventEmitter,
    private readonly gateway: EnvironmentUserListsGateway,
  ) {}

  async onModuleInit() {
    this.events.on('user-environment-presences.created', async (dto) => {
      if (dto.previous) {
        const list = await this.db.core.environmentUserLists.find(
          dto.previous.environment.id,
        );
        this.gateway.server
          .to(`${dto.previous.environment.id}`)
          .emit('updated', list);
      }

      const list = await this.db.core.environmentUserLists.find(
        dto.next.environment.id,
      );

      this.gateway.server
        .to(`${dto.next.environment.id}`)
        .emit('updated', list);
    });
  }

  @Get('environments/:id/user-list')
  @ApiOperation({
    summary: 'Get by Environment',
    operationId: 'getEnvironmentUserList',
  })
  @ApiParam({
    name: 'id',
    description: 'The Id of the environment',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A list of users for the specified environment',
    schema: zodToOpenAPI(EnvironmentUserListDtoSchema),
  })
  findAll(@Param('id', ParseIntPipe) id: number) {
    return this.db.core.environmentUserLists.find(id);
  }
}
