import { UserSchema } from '@2pm/schemas';
import { createZodDto } from '@anatine/zod-nestjs';

export class UserDto extends createZodDto(UserSchema) {}
