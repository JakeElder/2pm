import { AiMessageDto } from '@2pm/core';
import { AppEventEmitter } from '../event-emitter';
import { type DBService } from '@2pm/core/db';
import {
  Controller,
  Get,
  Param,
  Inject,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AiMessagesGateway } from './ai-messages.gateway';

@ApiTags('Ai Messages')
@Controller('ai-messages')
export class AiMessagesController {
  constructor(
    @Inject('DB') private readonly db: DBService,
    @Inject('E') private readonly events: AppEventEmitter,
    private readonly gateway: AiMessagesGateway,
  ) {}

  async onModuleInit() {
    this.events.on('ai-messages.updated', (e) => {
      this.gateway.server.to(`${e.aiMessage.id}`).emit('updated', e);
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Get',
    operationId: 'getAiMessages',
  })
  @ApiResponse({
    status: 200,
    type: [AiMessageDto],
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  findAll() {
    return this.db.app.aiMessages.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one',
    operationId: 'getOneAiMessage',
  })
  @ApiParam({
    name: 'id',
    description: 'The Id of the message',
    type: Number,
  })
  @ApiOkResponse({
    description: 'The Ai message',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [message] = await this.db.app.aiMessages.findAll({ id, limit: 1 });

    if (!message) {
      throw new NotFoundException(`Message with Id ${id} not found`);
    }

    return message;
  }
}
