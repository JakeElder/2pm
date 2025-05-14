import { Controller, Get, Inject } from '@nestjs/common';
import { DBService } from '@2pm/core/db';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpaceListDtoSchema } from '@2pm/core';
import { zodToOpenAPI } from 'nestjs-zod';
import { AppEventEmitter } from '../event-emitter';
import { SpaceListsGateway } from './space-lists.gateway';

@ApiTags('Space Lists')
@Controller('space-lists')
export class SpaceListsController {
  constructor(
    @Inject('DB') private readonly db: DBService,
    @Inject('E') private readonly events: AppEventEmitter,
    private readonly gateway: SpaceListsGateway,
  ) {}

  async onModuleInit() {
    this.events.on('user-environment-presences.created', async () => {
      const list = await this.db.spaceLists.find();
      this.gateway.server.to('main').emit('updated', list);
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Get',
    operationId: 'getSpaceList',
  })
  @ApiResponse({
    status: 200,
    schema: zodToOpenAPI(SpaceListDtoSchema),
  })
  async findOne() {
    const spaceList = await this.db.spaceLists.find();
    return spaceList;
  }
}
