import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import * as schema from "../../db/app.schema";

/**
 * Create
 */
export const CreateEnvironmentDtoSchema = createInsertSchema(
  schema.environments,
);

export class CreateEnvironmentDto extends createZodDto(
  CreateEnvironmentDtoSchema,
) {}

/**
 * Read
 */
export const EnvironmentDtoSchema = createSelectSchema(schema.environments);

export class EnvironmentDto extends createZodDto(EnvironmentDtoSchema) {}
