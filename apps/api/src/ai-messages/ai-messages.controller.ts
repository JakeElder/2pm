import {
  CreateAiMessageDto,
  AiMessageHydratedPlotPointDto,
  UpdateAiMessageDto,
  AiMessageDto,
} from '@2pm/data';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  OnModuleInit,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AiMessagesService } from './ai-messages.service';
import { AppEventEmitter } from '../event-emitter';

@ApiTags('Ai Messages')
@Controller('ai-messages')
export class AiMessagesController implements OnModuleInit {
  constructor(
    private readonly service: AiMessagesService,
    @Inject('E') private events: AppEventEmitter,
  ) {}

  onModuleInit() {
    this.events.on('ai-message.updated', (e) =>
      this.service.sendAiMessageUpdatedEvent(e),
    );
  }

  @UsePipes(ZodValidationPipe)
  @Post()
  @ApiOperation({ summary: 'Create', operationId: 'createAiMessage' })
  @ApiResponse({ status: 201, type: AiMessageHydratedPlotPointDto })
  async create(@Body() createDto: CreateAiMessageDto) {
    const dto = await this.service.create(createDto);
    this.events.emit('ai-message.created', dto);
    return dto;
  }

  @UsePipes(ZodValidationPipe)
  @Patch()
  @ApiOperation({ summary: 'Update', operationId: 'updateAiMessage' })
  @ApiResponse({ status: 200, type: AiMessageDto })
  async update(@Body() updateDto: UpdateAiMessageDto) {
    const res = await this.service.update(updateDto);

    if (!res) {
      throw new NotFoundException(
        `AI Message with Id ${updateDto.aiMessageId} not found`,
      );
    }

    this.events.emit('ai-message.updated', res);
    return res;
  }
}
