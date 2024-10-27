import { Controller, Get, Inject, OnModuleInit, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
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

@ApiTags('Messages')
@ApiExtraModels(AiUserMessageDto)
@Controller('messages')
export class MessagesController implements OnModuleInit {
  constructor(
    private readonly service: MessagesService,
    @Inject('E') private events: AppEventEmitter,
  ) {}

  onModuleInit() {
    this.events.on('messages.updated', (e) =>
      this.service.sendMessageUpdatedEvent(e),
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
    return this.service.findAll({ type });
  }
}
