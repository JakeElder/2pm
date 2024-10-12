import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  OnModuleInit,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  AiMessageDto,
  CreateAiMessageDto,
  CreateHumanMessageDto,
  HumanMessageDto,
  UpdateAiMessageDto,
  UpdateHumanMessageDto,
} from '@2pm/data';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { AppEventEmitter } from '../event-emitter';

@ApiExtraModels(HumanMessageDto)
@ApiExtraModels(AiMessageDto)
@Controller('messages')
export class MessagesController implements OnModuleInit {
  constructor(
    private readonly service: MessagesService,
    @Inject('E') private events: AppEventEmitter,
  ) {}

  onModuleInit() {
    this.events.on('messages.updated', (e) =>
      this.service.sendMessageUpdatedEvent(e),
    );
  }

  @ApiTags('Messages')
  @Get()
  @ApiOperation({
    summary: 'Get',
    operationId: 'getMessages',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of messages',
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { $ref: getSchemaPath(HumanMessageDto) },
          { $ref: getSchemaPath(AiMessageDto) },
        ],
      },
    },
  })
  findAll() {
    return this.service.findAll();
  }

  /**
   * Human
   */
  @ApiTags('Human Messages')
  @Get('/human')
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

  @ApiTags('Human Messages')
  @UsePipes(ZodValidationPipe)
  @Post('/human')
  @ApiOperation({ summary: 'Create', operationId: 'createHumanMessage' })
  @ApiResponse({ status: 201, type: HumanMessageDto })
  async create(@Body() createDto: CreateHumanMessageDto) {
    const dto = await this.service.create(createDto);
    this.events.emit('messages.created', dto);
    return dto;
  }

  @ApiTags('Human Messages')
  @UsePipes(ZodValidationPipe)
  @Patch('/human')
  @ApiOperation({ summary: 'Update', operationId: 'updateHumanMessage' })
  @ApiResponse({ status: 200, type: HumanMessageDto })
  async updateHuman(@Body() updateDto: UpdateHumanMessageDto) {
    const res = await this.service.update(updateDto);
    this.events.emit('messages.updated', res);
    return res;
  }

  /**
   * Ai
   */
  @ApiTags('Ai Messages')
  @Get('/ai')
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

  @ApiTags('Ai Messages')
  @UsePipes(ZodValidationPipe)
  @Post('/ai')
  @ApiOperation({ summary: 'Create', operationId: 'createAiMessage' })
  @ApiResponse({ status: 201, type: AiMessageDto })
  async createAi(@Body() createDto: CreateAiMessageDto) {
    const dto = await this.service.create(createDto);
    this.events.emit('messages.created', dto);
    return dto;
  }

  @ApiTags('Ai Messages')
  @UsePipes(ZodValidationPipe)
  @Patch('/ai')
  @ApiOperation({ summary: 'Update', operationId: 'updateAiMessage' })
  @ApiResponse({ status: 200, type: AiMessageDto })
  async updateAi(@Body() updateDto: UpdateAiMessageDto) {
    const res = await this.service.update(updateDto);
    this.events.emit('messages.updated', res);
    return res;
  }
}
