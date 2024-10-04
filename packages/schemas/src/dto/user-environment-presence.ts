import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  environments,
  plotPoints,
  userEnvironmentPresences,
  users,
} from "../drizzle/schema";
import { createZodDto } from "@anatine/zod-nestjs";

const UserEnvironmentPresenceDtoSchema = z.object({
  plotPoint: createSelectSchema(plotPoints),
  environment: createSelectSchema(environments),
  userEnvironmentPresence: createSelectSchema(userEnvironmentPresences),
});

const CreateUserEnvironmentPresenceDtoSchema = z.object({
  userId: createSelectSchema(users).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
});

class UserEnvironmentPresenceDto extends createZodDto(
  UserEnvironmentPresenceDtoSchema,
) {}
class CreateUserEnvironmentPresenceDto extends createZodDto(
  CreateUserEnvironmentPresenceDtoSchema,
) {}

export {
  UserEnvironmentPresenceDtoSchema,
  UserEnvironmentPresenceDto,
  CreateUserEnvironmentPresenceDto,
  CreateUserEnvironmentPresenceDtoSchema,
};
