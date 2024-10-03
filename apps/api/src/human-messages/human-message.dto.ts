import { HumanMessageSchema } from '@2pm/schemas';
import { environments, messages, users } from '@2pm/schemas/drizzle';
import { createZodDto } from '@anatine/zod-nestjs';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export class HumanMessageDto extends createZodDto(HumanMessageSchema) {}

const MessageSchema = createSelectSchema(messages);
const EnvironmentSchema = createSelectSchema(environments);
const UserSchema = createSelectSchema(users);

export const CreateHumanMessageSchema = z.object({
  userId: UserSchema.shape.id,
  environmentId: EnvironmentSchema.shape.id,
  content: MessageSchema.shape.content,
});

export class CreateHumanMessageDto extends createZodDto(
  CreateHumanMessageSchema,
) {}
