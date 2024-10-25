import {
  Body,
  Controller,
  Get,
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
} from '@2pm/data';
import { EnvironmentsService } from './environments.service';

@ApiTags('Environments')
@Controller()
export class CompanionOneToOneEnvironmentsController {
  constructor(private readonly service: EnvironmentsService) {}

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
    return this.service.findCompanionOneToOneEnvironments();
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
    const dto = await this.service.findCompanionOneToOneEnvironmentByUserId(id);
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
    const dto = await this.service.create(createDto);
    return dto;
  }
}
