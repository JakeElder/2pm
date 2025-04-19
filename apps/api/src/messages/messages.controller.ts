import { Controller, Get, Inject, OnModuleInit, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { AiUserMessageDto, MESSAGE_TYPES, type MessageType } from '@2pm/data';
import { AppEventEmitter } from '../event-emitter';
import DBService from '@2pm/db';
import { MessagesGateway } from './messages.gateway';

@ApiTags('Messages')
@ApiExtraModels(AiUserMessageDto)
@Controller('messages')
export class MessagesController implements OnModuleInit {
  constructor(
    @Inject('E') private events: AppEventEmitter,
    @Inject('DB') private readonly db: DBService,
    private readonly gateway: MessagesGateway,
  ) {}

  onModuleInit() {
    this.events.on('messages.updated', (dto) =>
      this.gateway.sendMessageUpdated(dto),
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get',
    operationId: 'getMessages',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of messages',
    schema: {
      type: 'array',
      items: {
        oneOf: [{ $ref: getSchemaPath(AiUserMessageDto) }],
      },
    },
  })
  @ApiQuery({
    name: 'type',
    enum: MESSAGE_TYPES,
    required: false,
  })
  async findAll(@Query('type') type?: MessageType) {
    return this.db.messages.findAll({ type });
  }
}
