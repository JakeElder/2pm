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
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AnonymousUserDto,
  AuthenticatedUserDto,
  CreateHumanUserDto,
  HumanUserDtoSchema,
  type HumanUser,
} from '@2pm/core';
import { type DBService } from '@2pm/core/db';
import { zodToOpenAPI } from 'nestjs-zod';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@ApiExtraModels(AnonymousUserDto)
@ApiExtraModels(AuthenticatedUserDto)
@ApiTags('Human Users')
@Controller('human-users')
export class HumanUsersController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get',
    operationId: 'getHumanUser',
  })
  @ApiResponse({
    status: 200,
    description: 'Get a human user by Id',
    schema: zodToOpenAPI(HumanUserDtoSchema),
  })
  @ApiParam({
    name: 'id',
    description: 'The users id',
    type: String,
  })
  async findOne(@Param('id') id: HumanUser['id']) {
    const res = await this.db.app.humanUsers.find(id);
    if (!res) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return res;
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Create',
    operationId: 'createHumanUser',
  })
  @ApiBody({ type: CreateHumanUserDto, required: false })
  @ApiResponse({
    status: 201,
    schema: zodToOpenAPI(HumanUserDtoSchema),
  })
  async create(@Body() createDto?: CreateHumanUserDto) {
    const dto = await this.db.app.humanUsers.create(createDto);
    return dto;
  }
}
