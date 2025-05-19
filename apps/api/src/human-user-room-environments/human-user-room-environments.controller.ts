import {
  EnvironmentDto,
  FindUserRoomEnvironmentByPathDto,
  FindUserRoomEnvironmentByPathDtoSchema,
} from '@2pm/core';
import { DBService } from '@2pm/core/db';
import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Human User Room Environments')
@Controller('human-user-room-environments')
export class HumanUserRoomEnvironmentsController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get()
  @ApiOperation({
    summary: 'Get by path',
    operationId: 'getHumanUserRoomEnvironmentByPath',
  })
  @ApiQuery({
    name: 'tag',
    type: String,
  })
  @ApiQuery({
    name: 'channel',
    type: String,
  })
  @ApiOkResponse({
    description: 'The world room environment',
    type: EnvironmentDto,
  })
  async findByPath(@Query() q: FindUserRoomEnvironmentByPathDto) {
    const query = FindUserRoomEnvironmentByPathDtoSchema.parse(q);

    const environment =
      await this.db.humanUserRoomEnvironments.findByPath(query);

    if (!environment) {
      throw new NotFoundException(
        `Environment @${query.tag}/${query.channel} not found`,
      );
    }

    return environment;
  }
}
