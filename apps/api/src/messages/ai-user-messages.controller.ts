import { Body, Controller, Get, Inject, Patch, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiUserMessageDto, UpdateAiUserMessageDto } from '@2pm/data';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { AppEventEmitter } from '../event-emitter';
import DBService from '@2pm/db';

@ApiTags('Messages')
@Controller('/messages/ai-user')
export class AiUserMessagesController {
  constructor(
    @Inject('E') private events: AppEventEmitter,
    @Inject('DB') private readonly db: DBService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '[Ai User] Get',
    operationId: 'getAiUserMessages',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Ai User messages',
    type: [AiUserMessageDto],
  })
  find() {
    return this.db.messages.findAiUser();
  }

  @UsePipes(ZodValidationPipe)
  @Patch()
  @ApiOperation({
    summary: '[Ai User] Update',
    operationId: 'updateAiUserMessage',
  })
  @ApiResponse({ status: 200, type: AiUserMessageDto })
  async update(@Body() updateDto: UpdateAiUserMessageDto) {
    const res = await this.db.messages.update(updateDto);
    this.events.emit('messages.updated', res);
    return res;
  }
}
