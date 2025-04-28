import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { type DBService } from '@2pm/core/db';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  CreateHumanMessageDto,
  HumanMessageDto,
  type HumanMessage,
} from '@2pm/core';

@ApiTags('Human Messages')
@Controller('human-messages')
export class HumanMessagesController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Create',
    operationId: 'createHumanMessage',
  })
  @ApiResponse({ status: 201, type: HumanMessageDto })
  async create(@Body() createDto: CreateHumanMessageDto) {
    const dto = await this.db.core.humanMessages.create(createDto);
    return dto;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete',
    operationId: 'deleteHumanMessage',
  })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  @ApiParam({
    name: 'id',
    description: 'The human message id',
    type: String,
  })
  async delete(@Param('id') id: HumanMessage['id']) {
    await this.db.core.humanMessages.delete(id);
  }
}
