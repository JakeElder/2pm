import { CreateHumanMessageDto, HumanMessageDto } from '@2pm/data/dtos';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { HumanMessagesService } from './human-messages.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiTags('Human Messages')
@Controller()
export class HumanMessagesController {
  constructor(
    private readonly service: HumanMessagesService,
    private events: EventEmitter2,
  ) {}

  @UsePipes(ZodValidationPipe)
  @Post('human-message')
  @ApiOperation({ summary: 'Create', operationId: 'createHumanMessage' })
  @ApiResponse({ status: 201, type: HumanMessageDto })
  async create(@Body() createDto: CreateHumanMessageDto) {
    const dto = await this.service.create(createDto);
    this.events.emit('human-message.created', dto);
    return dto;
  }
}
