import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { HumanMessagesService } from './human-messages.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HumanMessageDto } from './human-message.dto';

@ApiTags('Human Messages')
@Controller()
export class HumanMessagesController {
  constructor(private readonly humanMessagesService: HumanMessagesService) {}

  @Get('plot-points/:id/human-message')
  @ApiOperation({
    summary: 'Get by Plot Point',
    operationId: 'getHumanMessageByPlotPointId',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    type: HumanMessageDto,
  })
  async getHumanMessageByPlotPointId(@Param('id', ParseIntPipe) id: number) {
    const humanMessage =
      await this.humanMessagesService.getHumanMessageByPlotPointId(id);

    if (!humanMessage) {
      throw new NotFoundException(
        `Human Message not found for plot point ID: ${id}`,
      );
    }

    return humanMessage;
  }
}
