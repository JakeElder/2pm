import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CompanionEnvironmentDto,
  CreateCompanionEnvironmentDto,
} from '@2pm/core';
import { DBService } from '@2pm/core/db';

@ApiTags('Environments')
@Controller()
export class CompanionEnvironmentsController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get('environments/companion')
  @ApiOperation({
    summary: '[Companion] Get',
    operationId: 'getCompanionEnvironments',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of companion one to one environments',
    type: [CompanionEnvironmentDto],
  })
  find() {
    return this.db.environments.findCompanionEnvironments();
  }

  @Get('users/:id/companion')
  @ApiOperation({
    summary: '[Companion] Get by User Id',
    operationId: 'getCompanionEnvironmentsByUserId',
  })
  @ApiParam({
    name: 'id',
    description: 'The users id',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the companion environment for a specific user',
    type: CompanionEnvironmentDto,
  })
  async findByUserId(@Param('id', ParseIntPipe) id: number) {
    const dto = await this.db.environments.findCompanionEnvironmentByUserId(id);
    if (!dto) {
      throw new NotFoundException();
    }
    return dto;
  }

  @Post('environments/companion')
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: '[Companion] Create',
    operationId: 'createCompanionEnvironment',
  })
  @ApiResponse({ status: 201, type: CompanionEnvironmentDto })
  async create(@Body() createDto: CreateCompanionEnvironmentDto) {
    const dto = await this.db.environments.insert(createDto);
    return dto;
  }
}
