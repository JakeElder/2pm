import { BibleVerseDto } from '@2pm/core';
import { DBService } from '@2pm/core/db';
import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Bible Verses')
@Controller('bible-verses')
export class BibleVersesController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get()
  @ApiOperation({
    summary: 'Get',
    operationId: 'getBibleVerses',
  })
  @ApiResponse({
    status: 200,
    type: [BibleVerseDto],
  })
  findAll() {
    return this.db.bibleVerses.findAll();
  }
}
