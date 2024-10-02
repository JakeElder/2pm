import { HumanMessageSchema } from '@2pm/schemas';
import { createZodDto } from '@anatine/zod-nestjs';

export class HumanMessageDto extends createZodDto(HumanMessageSchema) {}
