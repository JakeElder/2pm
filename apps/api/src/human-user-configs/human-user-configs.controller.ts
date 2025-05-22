import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HumanUserConfigsGateway } from './human-user-configs.gateway';
import { AppEventEmitter } from '../event-emitter';
import { zodToOpenAPI } from 'nestjs-zod';
import {
  type HumanUser,
  HumanUserConfigDtoSchema,
  HumanUserConfigUpdatedPlotPointDtoSchema,
  UpdateHumanUserConfigDto,
} from '@2pm/core';
import { DBService } from '@2pm/core/db';

@ApiTags('Human User Configs')
@Controller()
export class HumanUserConfigsController {
  constructor(
    @Inject('E') protected readonly events: AppEventEmitter,
    @Inject('DB') private readonly db: DBService,
    private readonly gateway: HumanUserConfigsGateway,
  ) {}

  async onModuleInit() {
    this.events.on('plot-points.created', ({ type, data }) => {
      if (type === 'HUMAN_USER_CONFIG_UPDATED') {
        this.gateway.server
          .to(`${data.humanUser.data.id}`)
          .emit('updated', { type, data });
      }
    });
  }

  @Post('human-users/:humanUserId/config')
  @ApiOperation({
    summary: 'Update',
    operationId: 'updateHumanUserConfig',
  })
  @ApiParam({
    name: 'humanUserId',
    description: 'The users id',
    type: String,
  })
  @ApiQuery({
    name: 'userId',
    description: 'The user id',
    type: Number,
  })
  @ApiQuery({
    name: 'environmentId',
    description: 'The Id of the environment changed from',
    type: Number,
  })
  @ApiQuery({
    name: 'siteMapSidebarState',
    description: 'If the sitemap sidebar is open',
    enum: ['OPEN', 'CLOSED'],
    required: false,
  })
  @ApiQuery({
    name: 'usersSidebarState',
    description: 'If the users sidebar is open',
    enum: ['OPEN', 'CLOSED'],
    required: false,
  })
  @ApiResponse({
    status: 201,
    schema: zodToOpenAPI(HumanUserConfigUpdatedPlotPointDtoSchema),
  })
  async update(
    @Param('humanUserId') humanUserId: HumanUser['id'],
    @Query()
    query: Omit<UpdateHumanUserConfigDto, 'humanUserId'>,
  ) {
    const dto = await this.db.humanUserConfigs.update({
      ...query,
      humanUserId,
    });
    this.events.emit('plot-points.created', dto);
    return dto;
  }

  @Get('human-users/:id/config')
  @ApiOperation({
    summary: 'Get',
    operationId: 'getHumanUserConfig',
  })
  @ApiResponse({
    status: 200,
    description: 'Get a human user config by Id',
    schema: zodToOpenAPI(HumanUserConfigDtoSchema),
  })
  @ApiParam({
    name: 'id',
    description: 'The users id',
    type: String,
  })
  async findOne(@Param('id') id: HumanUser['id']) {
    const res = await this.db.humanUserConfigs.find(id);
    if (!res) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return res;
  }
}
