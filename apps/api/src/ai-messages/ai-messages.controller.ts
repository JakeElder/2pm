import { Controller } from '@nestjs/common';
import { AiMessagesService } from './ai-messages.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Ai Messages')
@Controller()
export class AiMessagesController {
  constructor(private readonly aiMessagesService: AiMessagesService) {}
}
