import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateHumanUserDto, type HumanUser, HumanUserDto } from '@2pm/core';
import { type DBService } from '@2pm/core/db';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@ApiTags('Human Users')
@Controller('human-users')
export class HumanUsersController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get(':id')
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Get',
    operationId: 'getHumanUser',
  })
  @ApiResponse({
    status: 200,
    description: 'Get a human user by Id',
    schema: {
      oneOf: [{ $ref: getSchemaPath(HumanUserDto) }, { type: 'null' }],
    },
  })
  @ApiParam({
    name: 'id',
    description: 'The users Id',
    type: String,
  })
  async findOne(@Param('id') id: HumanUser['id']) {
    const res = this.db.core.humanUsers.find(id);
    return res;
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  @ApiOperation({
    summary: 'Create',
    operationId: 'createHumanUser',
  })
  @ApiBody({ type: CreateHumanUserDto, required: false })
  @ApiResponse({ status: 201, type: HumanUserDto })
  async create(@Body() createDto?: CreateHumanUserDto) {
    const dto = await this.db.core.humanUsers.create(createDto);
    return dto;
  }
}
