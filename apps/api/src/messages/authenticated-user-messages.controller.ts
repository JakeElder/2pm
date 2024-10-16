import { Body, Controller, Get, Inject, Patch, UsePipes } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AuthenticatedUserMessageDto,
  UpdateAuthenticatedUserMessageDto,
} from '@2pm/data';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { AppEventEmitter } from '../event-emitter';

@ApiTags('Messages')
@Controller('/messages/authenticated-user')
export class AuthenticatedUserMessagesController {
  constructor(
    private readonly service: MessagesService,
    @Inject('E') private events: AppEventEmitter,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get Authenticated User Messages',
    operationId: 'getAuthenticatedUserMessages',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of authenticated user messages',
    type: [AuthenticatedUserMessageDto],
  })
  find() {
    return this.service.findAuthenticatedUser();
  }

  @UsePipes(ZodValidationPipe)
  @Patch()
  @ApiOperation({
    summary: 'Update Authenticated User Messages',
    operationId: 'updateAuthenticatedUserMessage',
  })
  @ApiResponse({ status: 200, type: AuthenticatedUserMessageDto })
  async update(@Body() updateDto: UpdateAuthenticatedUserMessageDto) {
    const res = await this.service.update(updateDto);
    this.events.emit('messages.updated', res);
    return res;
  }
}
