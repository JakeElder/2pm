import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import {
  environments,
  plotPoints,
  userEnvironmentPresences,
  users,
} from "../../db/app.schema";
import { UserDtoSchema } from "../user/user.dto";

export const UserEnvironmentPresenceStateSchema = z.object({
  plotPoint: createSelectSchema(plotPoints).extend({
    createdAt: z.coerce.date(),
  }),
  environment: createSelectSchema(environments),
  userEnvironmentPresence: createSelectSchema(userEnvironmentPresences).extend({
    expired: z.coerce.date().nullable(),
  }),
  user: UserDtoSchema,
});

export const UserEnvironmentPresenceDtoSchema = z.object({
  previous: UserEnvironmentPresenceStateSchema.nullable(),
  next: UserEnvironmentPresenceStateSchema,
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
