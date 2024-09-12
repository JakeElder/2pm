import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ActorsService } from './actors.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { Actor } from '@2pm/schema/models';

@ApiTags('Actors')
@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get Actors' })
  // @ApiResponse({ status: 200, type: [Actor] })
  findAll() {
    return this.actorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Actor' })
  // @ApiResponse({ status: 200, type: Actor })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.actorsService.findOne(id);
  }
}
