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
  CompanionOneToOneEnvironmentDto,
  CreateCompanionOneToOneEnvironmentDto,
} from '@2pm/core';
import { DBService } from '@2pm/core/db';

@ApiTags('Environments')
@Controller()
export class CompanionOneToOneEnvironmentsController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get('environments/companion-one-to-one')
  @ApiOperation({
    summary: '[O2O] Get',
    operationId: 'getCompanionOneToOneEnvironments',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of companion one to one environments',
    type: [CompanionOneToOneEnvironmentDto],
  })
  find() {
    return this.db.environments.findCompanionOneToOneEnvironments();
  }

  @Get('users/:id/companion-one-to-one-environment')
  @ApiOperation({
    summary: '[O2O] Get by User Id',
    operationId: 'getCompanionOneToOneEnvironmentsByUserId',
  })
  @ApiParam({
    name: 'id',
    description: 'The users id',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the companion one to one environment for a specific user',
    type: CompanionOneToOneEnvironmentDto,
  })
  async findByUserId(@Param('id', ParseIntPipe) id: number) {
    const dto =
      await this.db.environments.findCompanionOneToOneEnvironmentByUserId(id);
    if (!dto) {
      throw new NotFoundException();
    }
    return dto;
  }

  @Post('environments/companion-one-to-one')
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: '[O2O] Create',
    operationId: 'createCompanionOneToOneEnvironment',
  })
  @ApiResponse({ status: 201, type: CompanionOneToOneEnvironmentDto })
  async create(@Body() createDto: CreateCompanionOneToOneEnvironmentDto) {
    const dto = await this.db.environments.insert(createDto);
    return dto;
  }
}
