import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnonymousUserDto, CreateAnonymousUserDto } from '@2pm/data';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users/anonymous')
export class AnonymousUsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Anonymous Users',
    operationId: 'getAnonymousUsers',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of Ai Message Plot Points',
    type: [AnonymousUserDto],
  })
  findUsersByEnvironment() {
    return this.service.findAnonymousUsers();
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Create Anonymous User',
    operationId: 'createAnonymousUser',
  })
  @ApiResponse({ status: 201, type: AnonymousUserDto })
  async create(@Body() createDto: CreateAnonymousUserDto) {
    const dto = await this.service.create(createDto);
    return dto;
  }
}
