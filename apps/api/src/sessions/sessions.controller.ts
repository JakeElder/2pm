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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSessionDto, type Session, SessionDtoSchema } from '@2pm/core';
import { type DBService } from '@2pm/core/db';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { zodToOpenAPI } from 'nestjs-zod';

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
    schema: {
      oneOf: [zodToOpenAPI(SessionDtoSchema), { type: 'null' }],
    },
  })
  @ApiParam({
    name: 'id',
    description: 'The users id',
    type: String,
  })
  async findOne(@Param('id') id: Session['id']) {
    const res = await this.db.app.sessions.find(id);
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
  @ApiResponse({
    status: 201,
    schema: zodToOpenAPI(SessionDtoSchema),
  })
  async create(@Body() createDto: CreateSessionDto) {
    const dto = await this.db.app.sessions.create(createDto);
    return dto;
  }
}
