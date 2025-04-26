import {
  WORLD_ROOM_CODES,
  WorldRoomEnvironmentDto,
  type WorldRoomEnvironmentId,
} from '@2pm/core';
import { type DBService } from '@2pm/core/db';
import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('World Room Environments')
@Controller('world-room-environments')
export class WorldRoomEnvironmentsController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get()
  @ApiOperation({
    summary: 'Get',
    operationId: 'getWorldRoomEnvironments',
  })
  @ApiResponse({
    status: 200,
    type: [WorldRoomEnvironmentsController],
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  findAll() {
    return this.db.core.worldRoomEnvironments.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one',
    operationId: 'getOneWorldRoomEnvironment',
  })
  @ApiParam({
    name: 'id',
    description: 'The Id of the message',
    enum: WORLD_ROOM_CODES,
  })
  @ApiOkResponse({
    description: 'The world room environment',
    type: WorldRoomEnvironmentDto,
  })
  async findOne(@Param('id') id: WorldRoomEnvironmentId) {
    const [environment] = await this.db.core.worldRoomEnvironments.findAll({
      id,
      limit: 1,
    });

    if (!environment) {
      throw new NotFoundException(`Environment ${id} not found`);
    }

    return environment;
  }
}
