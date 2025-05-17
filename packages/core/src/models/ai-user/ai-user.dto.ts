import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { aiUsers, environments } from "../../db/app.schema";
import { z } from "zod";

/**
 * Create
 */
export const CreateAiUserDtoSchema = createInsertSchema(aiUsers).omit({
  userId: true,
});

export class CreateAiUserDto extends createZodDto(CreateAiUserDtoSchema) {}

/**
 * Read
 */

export const AiUserDtoSchema = createSelectSchema(aiUsers);

export class AiUserDto extends createZodDto(AiUserDtoSchema) {}

/**
 * Filters
 */
export const FilterAiUsersDtoSchema = z.object({
  environmentId: createSelectSchema(environments).shape.id.optional(),
});

export class FilterAiUsersDto extends createZodDto(FilterAiUsersDtoSchema) {}
