import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
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
} from '@nestjs/swagger';
import {
  AnonymousUserDto,
  AuthenticatedUserDto,
  CreateHumanUserDto,
  HumanUserDtoSchema,
  HumanUserTagUpdatedPlotPointDtoSchema,
  UpdateHumanUserTagDto,
  UpdateHumanUserTagDtoSchema,
  type HumanUser,
} from '@2pm/core';
import { DBService } from '@2pm/core/db';
import { zodToOpenAPI } from 'nestjs-zod';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { AppEventEmitter } from 'src/event-emitter';
import { HumanUsersGateway } from './human-users.gateway';

@ApiExtraModels(AnonymousUserDto)
@ApiExtraModels(AuthenticatedUserDto)
@ApiTags('Human Users')
@Controller('human-users')
export class HumanUsersController {
  constructor(
    @Inject('E') protected readonly events: AppEventEmitter,
    @Inject('DB') private readonly db: DBService,
    private readonly gateway: HumanUsersGateway,
  ) {}

  async onModuleInit() {
    this.events.on('plot-points.created', ({ type, data }) => {
      if (type === 'HUMAN_USER_TAG_UPDATED') {
        this.gateway.server
          .to(`${data.humanUser.data.id}`)
          .emit('updated', { type, data });
      }
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get',
    operationId: 'getHumanUser',
  })
  @ApiResponse({
    status: 200,
    description: 'Get a human user by Id',
    schema: zodToOpenAPI(HumanUserDtoSchema),
  })
  @ApiParam({
    name: 'id',
    description: 'The users id',
    type: String,
  })
  async findOne(@Param('id') id: HumanUser['id']) {
    const res = await this.db.humanUsers.find(id);
    if (!res) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return res;
  }

  @Post(':id/tag')
  @ApiParam({
    name: 'id',
    description: 'The users id',
    type: String,
  })
  @ApiOperation({
    summary: 'Update Tag',
    operationId: 'updateHumanUserTag',
  })
  @ApiBody({
    schema: zodToOpenAPI(
      UpdateHumanUserTagDtoSchema.omit({
        humanUserId: true,
      }),
    ),
  })
  @ApiResponse({
    status: 201,
    schema: zodToOpenAPI(HumanUserTagUpdatedPlotPointDtoSchema),
  })
  async updateTag(
    @Param('id') id: HumanUser['id'],
    @Body() dto: Omit<UpdateHumanUserTagDto, 'humanUserId'>,
  ) {
    const res = await this.db.humanUsers.updateTag({
      ...dto,
      humanUserId: id,
    });
    return res;
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Create',
    operationId: 'createHumanUser',
  })
  @ApiBody({ type: CreateHumanUserDto, required: false })
  @ApiResponse({
    status: 201,
    schema: zodToOpenAPI(HumanUserDtoSchema),
  })
  async create(@Body() createDto?: CreateHumanUserDto) {
    const dto = await this.db.humanUsers.create(createDto);
    return dto;
  }
}
