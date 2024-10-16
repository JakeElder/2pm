import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { MessagesService } from './messages.service';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AiUserMessageDto, AuthenticatedUserMessageDto } from '@2pm/data';
import { AppEventEmitter } from '../event-emitter';

@ApiTags('Messages')
@ApiExtraModels(AuthenticatedUserMessageDto)
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
        oneOf: [
          { $ref: getSchemaPath(AuthenticatedUserMessageDto) },
          { $ref: getSchemaPath(AiUserMessageDto) },
        ],
      },
    },
  })
  findAll() {
    return this.service.findAll();
  }
}
