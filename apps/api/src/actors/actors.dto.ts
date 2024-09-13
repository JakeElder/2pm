import { ActorSchema } from '@2pm/schemas/zod';
import { createZodDto } from '@anatine/zod-nestjs';

export class ActorDto extends createZodDto(ActorSchema) {}
