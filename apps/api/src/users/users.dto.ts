import { UserSchema } from '@2pm/schemas/zod';
import { createZodDto } from '@anatine/zod-nestjs';

export class UserDto extends createZodDto(UserSchema) {}
