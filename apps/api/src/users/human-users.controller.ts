import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HumanUserDto, CreateHumanUserDto } from '@2pm/data';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users/human')
export class HumanUsersController {
  constructor(private readonly service: UsersService) {}

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
    return this.service.findHumanUsers();
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: '[Human] Create',
    operationId: 'createHumanUser',
  })
  @ApiResponse({ status: 201, type: HumanUserDto })
  async create(@Body() createDto: CreateHumanUserDto) {
    const dto = await this.service.create(createDto);
    return dto;
  }
}
