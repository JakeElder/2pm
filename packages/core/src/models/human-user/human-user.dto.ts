import { createInsertSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import * as schema from "../../db/app.schema";
import { z } from "zod";

/**
 * Create
 */
export const CreateHumanUserDtoSchema = createInsertSchema(
  schema.humanUsers,
).omit({ userId: true });

export class CreateHumanUserDto extends createZodDto(
  CreateHumanUserDtoSchema,
) {}
