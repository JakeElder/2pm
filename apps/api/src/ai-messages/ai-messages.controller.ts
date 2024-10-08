import { CreateAiMessageDto, AiMessageHydratedPlotPointDto } from '@2pm/data';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Body, Controller, Inject, Post, UsePipes } from '@nestjs/common';
import { AiMessagesService } from './ai-messages.service';
import { AppEventEmitter } from '../event-emitter';

@ApiTags('Ai Messages')
@Controller()
export class AiMessagesController {
  constructor(
    private readonly service: AiMessagesService,
    @Inject('E') private events: AppEventEmitter,
  ) {}

  @UsePipes(ZodValidationPipe)
  @Post('ai-message')
  @ApiOperation({ summary: 'Create', operationId: 'createAiMessage' })
  @ApiResponse({ status: 201, type: AiMessageHydratedPlotPointDto })
  async create(@Body() createDto: CreateAiMessageDto) {
    const dto = await this.service.create(createDto);
    this.events.emit('ai-message.created', dto);
    return dto;
  }
}
