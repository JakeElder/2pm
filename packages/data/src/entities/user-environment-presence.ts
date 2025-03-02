import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  environments,
  plotPoints,
  userEnvironmentPresences,
  users,
} from "../schema";
import { createZodDto } from "@anatine/zod-nestjs";

export const UserEnvironmentPresenceDtoSchema = z.object({
  plotPoint: createSelectSchema(plotPoints),
  environment: createSelectSchema(environments),
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
