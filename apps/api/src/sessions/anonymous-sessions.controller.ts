import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { AnonymousSessionDto, CreateAnonymousSessionDto } from '@2pm/data';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@ApiTags('Sessions')
@Controller('sessions/anonymous')
export class AnonymousSessionsController {
  constructor(private readonly service: SessionsService) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: '[Anonymous] Create',
    operationId: 'createAnonymousSession',
  })
  @ApiResponse({ status: 201, type: AnonymousSessionDto })
  async create(@Body() createDto: CreateAnonymousSessionDto) {
    const dto = await this.service.create(createDto);
    return dto;
  }
}
