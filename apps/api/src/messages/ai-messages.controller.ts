import { Body, Controller, Get, Inject, Patch, UsePipes } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiMessageDto, UpdateAiMessageDto } from '@2pm/data';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { AppEventEmitter } from '../event-emitter';

@ApiTags('Ai Messages')
@Controller('/messages/ai')
export class AiMessagesController {
  constructor(
    private readonly service: MessagesService,
    @Inject('E') private events: AppEventEmitter,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get',
    operationId: 'getAiMessages',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Ai messages',
    type: [AiMessageDto],
  })
  findAi() {
    return this.service.findAi();
  }

  @UsePipes(ZodValidationPipe)
  @Patch()
  @ApiOperation({ summary: 'Update', operationId: 'updateAiMessage' })
  @ApiResponse({ status: 200, type: AiMessageDto })
  async updateAi(@Body() updateDto: UpdateAiMessageDto) {
    const res = await this.service.update(updateDto);
    this.events.emit('messages.updated', res);
    return res;
  }
}
