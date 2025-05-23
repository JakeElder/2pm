import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { environments, humanUsers } from "../../db/app.schema";

/**
 * Change Tag
 */

export const UpdateHumanUserTagDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
  tag: z.string(),
});

export class UpdateHumanUserTagDto extends createZodDto(
  UpdateHumanUserTagDtoSchema,
) {}

/**
 * Create
 */
export const CreateHumanUserDtoSchema = createInsertSchema(humanUsers).omit({
  userId: true,
});

export class CreateHumanUserDto extends createZodDto(
  CreateHumanUserDtoSchema,
) {}
