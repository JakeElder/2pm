import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateSessionDto, type Session, SessionDto } from '@2pm/core';
import { type DBService } from '@2pm/core/db';
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
    isArray: false,
    schema: {
      oneOf: [{ $ref: getSchemaPath(SessionDto) }, { type: 'null' }],
    },
  })
  @ApiParam({
    name: 'id',
    description: 'The users id',
    type: String,
  })
  async findOne(@Param('id') id: Session['id']) {
    const res = await this.db.core.sessions.find(id);
    if (!res) {
      throw new NotFoundException(`Session ${id} not found`);
    }
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
    const dto = await this.db.core.sessions.create(createDto);
    return dto;
  }
}
