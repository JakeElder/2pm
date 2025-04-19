import { Body, Controller, Get, Inject, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HumanUserDto, CreateHumanUserDto } from '@2pm/data';
import DBService from '@2pm/db';

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
    return this.db.users.findHumanUsers();
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: '[Human] Create',
    operationId: 'createHumanUser',
  })
  @ApiResponse({ status: 201, type: HumanUserDto })
  async create(@Body() createDto: CreateHumanUserDto) {
    const dto = await this.db.users.insert(createDto);
    return dto;
  }
}
