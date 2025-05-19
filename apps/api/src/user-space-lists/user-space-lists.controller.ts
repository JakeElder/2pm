import { Controller, Get, Inject } from '@nestjs/common';
import { DBService } from '@2pm/core/db';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserSpaceListDtoSchema } from '@2pm/core';
import { zodToOpenAPI } from 'nestjs-zod';
import { AppEventEmitter } from '../event-emitter';
import { UserSpaceListsGateway } from './user-space-lists.gateway';

@ApiTags('User Space Lists')
@Controller('user-space-lists')
export class UserSpaceListsController {
  constructor(
    @Inject('DB') private readonly db: DBService,
    @Inject('E') private readonly events: AppEventEmitter,
    private readonly gateway: UserSpaceListsGateway,
  ) {}

  async onModuleInit() {
    this.events.on('user-environment-presences.created', async () => {
      const list = await this.db.userSpaceLists.find();
      this.gateway.server.to('main').emit('updated', list);
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Get',
    operationId: 'getUserSpaceLists',
  })
  @ApiResponse({
    status: 200,
    schema: zodToOpenAPI(UserSpaceListDtoSchema),
  })
  async findOne() {
    const spaceList = await this.db.userSpaceLists.find();
    return spaceList;
  }
}
