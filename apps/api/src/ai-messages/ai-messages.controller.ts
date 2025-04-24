import { AiMessageDto } from '@2pm/core';
import { DBService } from '@2pm/core/db';
import {
  Controller,
  Get,
  Param,
  Inject,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Ai Messages')
@Controller('ai-messages')
export class AiMessagesController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get()
  @ApiOperation({
    summary: 'Get',
    operationId: 'getAiMessages',
  })
  @ApiResponse({
    status: 200,
    type: [AiMessageDto],
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  findAll() {
    return this.db.aiMessages.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one',
    operationId: 'getOneAiMessage',
  })
  @ApiParam({
    name: 'id',
    description: 'The Id of the message',
    type: Number,
  })
  @ApiOkResponse({
    description: 'A list of plot points for the specified environment',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [message] = await this.db.aiMessages.findAll({ id, limit: 1 });

    if (!message) {
      throw new NotFoundException(`Message with Id ${id} not found`);
    }

    return message;
  }
}
