import { createInsertSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import * as schema from "../../db/core/core.schema";

/**
 * Create
 */
export const CreateHumanUserDtoSchema = createInsertSchema(
  schema.humanUsers,
).omit({ id: true, userId: true });

export class CreateHumanUserDto extends createZodDto(
  CreateHumanUserDtoSchema,
) {}
