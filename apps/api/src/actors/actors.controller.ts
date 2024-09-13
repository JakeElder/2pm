import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ActorsService } from './actors.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActorDto } from './actors.dto';
// import { Actor } from '@2pm/schema/models';

@ApiTags('Actors')
@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get Actors' })
  @ApiResponse({ status: 200, type: [ActorDto] })
  findAll() {
    return this.actorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Actor' })
  @ApiResponse({ status: 200, type: ActorDto })
  @ApiResponse({ status: 404, type: NotFoundException })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const actor = await this.actorsService.findOne(id);
    if (!actor) {
      throw new NotFoundException(`Actor with ID ${id} not found`);
    }
    return actor;
  }
}
