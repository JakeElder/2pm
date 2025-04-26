import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import {
  environments,
  plotPoints,
  userEnvironmentPresences,
  users,
} from "../../db/core/core.schema";

export const UserEnvironmentPresenceDtoSchema = z.object({
  plotPoint: createSelectSchema(plotPoints),
  userEnvironmentPresence: createSelectSchema(userEnvironmentPresences),
});

export const CreateUserEnvironmentPresenceDtoSchema = z.object({
  userId: createSelectSchema(users).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
});

export class UserEnvironmentPresenceDto extends createZodDto(
  UserEnvironmentPresenceDtoSchema,
) {}

export class CreateUserEnvironmentPresenceDto extends createZodDto(
  CreateUserEnvironmentPresenceDtoSchema,
) {}
