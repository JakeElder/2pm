import { CreateAiMessageDto, AiMessageDto } from '@2pm/data/dtos';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AiMessagesService } from './ai-messages.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiTags('Ai Messages')
@Controller()
export class AiMessagesController {
  constructor(
    private readonly service: AiMessagesService,
    private events: EventEmitter2,
  ) {}

  @UsePipes(ZodValidationPipe)
  @Post('ai-message')
  @ApiOperation({ summary: 'Create', operationId: 'createAiMessage' })
  @ApiResponse({ status: 201, type: AiMessageDto })
  async create(@Body() createDto: CreateAiMessageDto) {
    const dto = await this.service.create(createDto);
    this.events.emit('ai-message.created', dto);
    return dto;
  }
}
