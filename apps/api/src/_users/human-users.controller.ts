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
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HumanUserDto, CreateHumanUserDto } from '@2pm/core';
import { type DBService } from '@2pm/core/db';

@ApiTags('Users')
@Controller('users/human')
export class HumanUsersController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get()
  @ApiOperation({
    summary: '[Human] Get',
    operationId: 'getHumanUsers',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of human users',
    type: [HumanUserDto],
  })
  findUsersByEnvironment() {
    return this.db.core.users.findHumanUsers();
  }

  @Get(':id')
  @ApiOperation({
    summary: '[Human] Get By Id',
    operationId: 'getHumanUserById',
  })
  @ApiParam({
    name: 'id',
    description: 'The users id',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A single human user',
    type: HumanUserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findUserById(@Param('id') id: HumanUserDto['data']['user']['id']) {
    const user = await this.db.core.users.findHumanUserById(id);
    if (!user) {
      throw new NotFoundException(`User with Id ${id} not found`);
    }
    return user;
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: '[Human] Create',
    operationId: 'createHumanUser',
  })
  @ApiResponse({ status: 201, type: HumanUserDto })
  async create(@Body() createDto: CreateHumanUserDto) {
    const dto = await this.db.core.users.insert(createDto);
    return dto;
  }
}
