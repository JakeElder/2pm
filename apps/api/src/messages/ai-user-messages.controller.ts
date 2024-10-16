import { Body, Controller, Get, Inject, Patch, UsePipes } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiUserMessageDto, UpdateAiUserMessageDto } from '@2pm/data';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { AppEventEmitter } from '../event-emitter';

@ApiTags('Messages')
@Controller('/messages/ai-user')
export class AiUserMessagesController {
  constructor(
    private readonly service: MessagesService,
    @Inject('E') private events: AppEventEmitter,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get Ai User Messages',
    operationId: 'getAiUserMessages',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Ai User messages',
    type: [AiUserMessageDto],
  })
  find() {
    return this.service.findAiUser();
  }

  @UsePipes(ZodValidationPipe)
  @Patch()
  @ApiOperation({
    summary: 'Update Ai User Message',
    operationId: 'updateAiUserMessage',
  })
  @ApiResponse({ status: 200, type: AiUserMessageDto })
  async update(@Body() updateDto: UpdateAiUserMessageDto) {
    const res = await this.service.update(updateDto);
    this.events.emit('messages.updated', res);
    return res;
  }
}
