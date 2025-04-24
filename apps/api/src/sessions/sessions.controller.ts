import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSessionDto, type Session, SessionDto } from '@2pm/core';
import { DBService } from '@2pm/core/db';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get(':id')
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Get',
    operationId: 'getSession',
  })
  @ApiResponse({
    status: 200,
    description: 'Get a session by Id',
    type: SessionDto,
  })
  @ApiParam({
    name: 'id',
    description: 'The users id',
    type: String,
  })
  async findOne(@Param('id') id: Session['id']) {
    const res = this.db.sessions.find(id);
    return res;
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Create',
    operationId: 'createSession',
  })
  @ApiResponse({ status: 201, type: SessionDto })
  async create(@Body() createDto: CreateSessionDto) {
    const dto = await this.db.sessions.insert(createDto);
    return dto;
  }
}
