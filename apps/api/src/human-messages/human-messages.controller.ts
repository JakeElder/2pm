import { EnvironmentGateway } from '../environments/environments.gateway';
import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { type DBService } from '@2pm/core/db';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  CreateHumanMessageDto,
  HumanMessageDto,
  type HumanMessage,
} from '@2pm/core';

@ApiTags('Human Messages')
@Controller('human-messages')
export class HumanMessagesController {
  constructor(
    @Inject('DB') private readonly db: DBService,
    private readonly gateway: EnvironmentGateway,
  ) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Create',
    operationId: 'createHumanMessage',
  })
  @ApiResponse({ status: 201, type: HumanMessageDto })
  async create(@Body() createDto: CreateHumanMessageDto) {
    const data = await this.db.core.humanMessages.create(createDto);

    this.gateway.server
      .to(`${data.environment.id}`)
      .emit('plot-points.created', { type: 'HUMAN_MESSAGE', data });

    return data;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete',
    operationId: 'deleteHumanMessage',
  })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  @ApiParam({
    name: 'id',
    description: 'The human message id',
    type: String,
  })
  async delete(@Param('id') id: HumanMessage['id']) {
    await this.db.core.humanMessages.delete(id);
  }
}
