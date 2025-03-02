import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AiUserDto, HumanUserDto } from '@2pm/data';

@ApiExtraModels(HumanUserDto)
@ApiExtraModels(AiUserDto)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}
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
    return this.service.findAll();
  }
}
