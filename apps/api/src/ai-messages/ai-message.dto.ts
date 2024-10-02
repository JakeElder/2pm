import { AiMessageSchema } from '@2pm/schemas';
import { createZodDto } from '@anatine/zod-nestjs';

export class AiMessageDto extends createZodDto(AiMessageSchema) {}
