import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CompanionOneToOneEnvironmentDto,
  CreateCompanionOneToOneEnvironmentDto,
} from '@2pm/data';
import { EnvironmentsService } from './environments.service';

@ApiTags('Environments')
@Controller('environments/companion-one-to-one')
export class CompanionOneToOneEnvironmentsController {
  constructor(private readonly service: EnvironmentsService) {}

  @Get()
  @ApiOperation({
    summary: '[O2O] Get',
    operationId: 'getCompanionOneToOneEnvironments',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of companion one to one environments',
    type: [CompanionOneToOneEnvironmentDto],
  })
  findEnvironmentsByEnvironment() {
    return this.service.findCompanionOneToOneEnvironments();
  }

  @Post()
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
