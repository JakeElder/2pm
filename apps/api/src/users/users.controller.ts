import { Controller, Get, Inject } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AiUserDto, HumanUserDto } from '@2pm/data';
import DBService from '@2pm/db';

@ApiExtraModels(HumanUserDto)
@ApiExtraModels(AiUserDto)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(@Inject('DB') private readonly db: DBService) {}
  @Get()
  @ApiOperation({
    summary: 'Get',
    operationId: 'getUsers',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of users',
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { $ref: getSchemaPath(HumanUserDto) },
          { $ref: getSchemaPath(AiUserDto) },
        ],
      },
    },
  })
  findAll() {
    return this.db.users.findAll();
  }
}
