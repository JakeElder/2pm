import { EnvironmentsGateway } from '../environments/environments.gateway';
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
  HumanMessageDtoSchema,
  type HumanMessage,
} from '@2pm/core';
import { zodToOpenAPI } from 'nestjs-zod';
import { AppEventEmitter } from '../event-emitter';

@ApiTags('Human Messages')
@Controller('human-messages')
export class HumanMessagesController {
  constructor(
    @Inject('E') private events: AppEventEmitter,
    @Inject('DB') private readonly db: DBService,
    private readonly gateway: EnvironmentsGateway,
  ) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Create',
    operationId: 'createHumanMessage',
  })
  @ApiResponse({
    status: 201,
    schema: zodToOpenAPI(HumanMessageDtoSchema),
  })
  async create(@Body() createDto: CreateHumanMessageDto) {
    const data = await this.db.app.humanMessages.create(createDto);
    this.events.emit('plot-points.created', { type: 'HUMAN_MESSAGE', data });
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
    await this.db.app.humanMessages.delete(id);
  }
}
