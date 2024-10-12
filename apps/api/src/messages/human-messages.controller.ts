import { Body, Controller, Get, Inject, Patch, UsePipes } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HumanMessageDto, UpdateHumanMessageDto } from '@2pm/data';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { AppEventEmitter } from '../event-emitter';

@ApiTags('Human Messages')
@Controller('/messages/human')
export class HumanMessagesController {
  constructor(
    private readonly service: MessagesService,
    @Inject('E') private events: AppEventEmitter,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get',
    operationId: 'getHumanMessages',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Human messages',
    type: [HumanMessageDto],
  })
  findHuman() {
    return this.service.findHuman();
  }

  @UsePipes(ZodValidationPipe)
  @Patch()
  @ApiOperation({ summary: 'Update', operationId: 'updateHumanMessage' })
  @ApiResponse({ status: 200, type: HumanMessageDto })
  async updateHuman(@Body() updateDto: UpdateHumanMessageDto) {
    const res = await this.service.update(updateDto);
    this.events.emit('messages.updated', res);
    return res;
  }
}
