import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AiMessagesService } from './ai-messages.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiMessageDto } from './ai-message.dto';

@ApiTags('Ai Messages')
@Controller()
export class AiMessagesController {
  constructor(private readonly aiMessagesService: AiMessagesService) {}

  @Get('plot-points/:id/ai-message')
  @ApiOperation({
    summary: 'Get by Plot Point',
    operationId: 'getAiMessageByPlotPointId',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    type: AiMessageDto,
  })
  async getAiMessageByPlotPointId(@Param('id', ParseIntPipe) id: number) {
    const aiMessage =
      await this.aiMessagesService.getAiMessageByPlotPointId(id);

    if (!aiMessage) {
      throw new NotFoundException(
        `Ai Message not found for plot point Id: ${id}`,
      );
    }

    return aiMessage;
  }
}
