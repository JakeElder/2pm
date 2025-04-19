import {
  Body,
  Controller,
  Get,
  Inject,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSessionDto, FindSessionsQueryDto, SessionDto } from '@2pm/core';
import { DBService } from '@2pm/core/db';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Get',
    operationId: 'getSessions',
  })
  @ApiResponse({
    status: 200,
    description: 'The array of sessions',
    type: [SessionDto],
  })
  @ApiQuery({
    name: 'ids',
    required: false,
    isArray: true,
    type: [String],
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  async find(
    @Query('ids', new ParseArrayPipe({ optional: true }))
    ids: FindSessionsQueryDto['ids'],
    @Query('limit', new ParseIntPipe({ optional: true }))
    limit: FindSessionsQueryDto['limit'],
  ) {
    const res = this.db.sessions.find({ ids, limit });
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
