import {
  CreateHumanMessageDto,
  HumanMessageHydratedPlotPointDto,
} from '@2pm/data';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Body, Controller, Inject, Post, UsePipes } from '@nestjs/common';
import { HumanMessagesService } from './human-messages.service';
import { AppEventEmitter } from '../event-emitter';

@ApiTags('Human Messages')
@Controller('human-messages')
export class HumanMessagesController {
  constructor(
    private readonly service: HumanMessagesService,
    @Inject('E') private events: AppEventEmitter,
  ) {}

  @UsePipes(ZodValidationPipe)
  @Post()
  @ApiOperation({ summary: 'Create', operationId: 'createHumanMessage' })
  @ApiResponse({ status: 201, type: HumanMessageHydratedPlotPointDto })
  async create(@Body() createDto: CreateHumanMessageDto) {
    const dto = await this.service.create(createDto);
    this.events.emit('human-message.created', dto);
    return dto;
  }
}
