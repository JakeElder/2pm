import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
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
  getAiMessageByPlotPointId(@Param('id', ParseIntPipe) id: number) {
    return this.aiMessagesService.getAiMessageByPlotPointId(id);
  }
}
