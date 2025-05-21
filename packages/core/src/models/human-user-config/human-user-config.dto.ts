import { createZodDto } from "@anatine/zod-nestjs";
import { createSelectSchema, createUpdateSchema } from "drizzle-zod";
import {
  environments,
  humanUserConfigs,
  humanUsers,
  users,
} from "../../db/app.schema";

/**
 * Read
 */
export const HumanUserConfigDtoSchema = createSelectSchema(humanUserConfigs);

export class HumanUserConfigDto extends createZodDto(
  HumanUserConfigDtoSchema,
) {}

/**
 * Update
 */

export const UpdateHumanUserConfigDtoSchema = createUpdateSchema(
  humanUserConfigs,
).extend({
  environmentId: createSelectSchema(environments).shape.id,
  userId: createSelectSchema(users).shape.id,
  humanUserId: createSelectSchema(humanUsers).shape.id,
});

export class UpdateHumanUserConfigDto extends createZodDto(
  UpdateHumanUserConfigDtoSchema,
) {}
