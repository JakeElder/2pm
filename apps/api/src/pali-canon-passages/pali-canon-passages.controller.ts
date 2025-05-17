import {
  PaliCanonPassageDtoSchema,
  PaliCanonPassageVectorQueryDto,
} from '@2pm/core';
import { DBService } from '@2pm/core/db';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { z } from 'zod';

@ApiTags('Pali Canon Passages')
@Controller('pali-canon-passages')
export class PaliCanonPassagesController {
  constructor(@Inject('DB') private readonly db: DBService) {}

  @Get('vector-query')
  @ApiOperation({
    summary: 'Vector Query',
    operationId: 'vectorQueryPaliCanonPassages',
  })
  @ApiQuery({
    name: 'text',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: 200,
    schema: zodToOpenAPI(z.array(PaliCanonPassageDtoSchema)),
  })
  async vectorQuery(@Query() { text }: PaliCanonPassageVectorQueryDto) {
    const res = await this.db.paliCanonPassages.vectorQuery(text);
    return res;
  }
}
