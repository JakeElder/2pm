import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import * as schema from "../../db/schema";

/**
 * Create
 */
export const CreateHumanUserDtoSchema = createInsertSchema(schema.humanUsers)
  .omit({ id: true, userId: true })
  .partial({ locationEnvironmentId: true });

export class CreateHumanUserDto extends createZodDto(
  CreateHumanUserDtoSchema,
) {}

/**
 * Read
 */
export const HumanUserDtoSchema = createSelectSchema(schema.humanUsers);

export class HumanUserDto extends createZodDto(HumanUserDtoSchema) {}
