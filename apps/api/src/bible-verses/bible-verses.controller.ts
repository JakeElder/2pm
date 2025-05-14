import { BibleVerseDto, BibleVerseVectorQueryDto } from '@2pm/core';
import { DBService } from '@2pm/core/db';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

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

  @Get('vector-query')
  @ApiOperation({
    summary: 'Vector Query',
    operationId: 'vectorQueryBibleVerses',
  })
  @ApiQuery({
    name: 'text',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: 200,
    type: [BibleVerseDto],
  })
  async vectorQuery(@Query() { text }: BibleVerseVectorQueryDto) {
    const res = await this.db.bibleVerses.vectorQuery(text);
    return res;
  }
}
