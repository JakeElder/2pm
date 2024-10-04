import { CreateHumanMessageDto, HumanMessageDto } from '@2pm/schemas/dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { HumanMessagesService } from './human-messages.service';
import { EnvironmentsGateway } from '../environments/environments.gateway';

@ApiTags('Human Messages')
@Controller()
export class HumanMessagesController {
  constructor(
    private readonly service: HumanMessagesService,
    private readonly gateway: EnvironmentsGateway,
  ) {}

  @Get('plot-points/:id/human-message')
  @ApiOperation({
    summary: 'Get By Plot Point',
    operationId: 'getHumanMessageByPlotPointId',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: HumanMessageDto })
  async getByPlotPointId(@Param('id', ParseIntPipe) id: number) {
    const message = await this.service.getByPlotPointId(id);

    if (!message) {
      throw new NotFoundException(
        `Human Message not found for plot point Id: ${id}`,
      );
    }

    return message;
  }

  @UsePipes(ZodValidationPipe)
  @Post('human-message')
  @ApiOperation({ summary: 'Create', operationId: 'createHumanMessage' })
  @ApiResponse({ status: 201, type: HumanMessageDto })
  async create(@Body() dto: CreateHumanMessageDto) {
    const res = await this.service.create(dto);
    this.gateway.sendPlotPointUpdate(dto.environmentId, res.plotPoint);
    return res;
  }
}
