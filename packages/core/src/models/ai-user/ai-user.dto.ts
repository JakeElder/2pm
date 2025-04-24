import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import * as schema from "../../db/schema";

/**
 * Create
 */
export const CreateAiUserDtoSchema = createInsertSchema(schema.aiUsers).omit({
  userId: true,
});

export class CreateAiUserDto extends createZodDto(CreateAiUserDtoSchema) {}

/**
 * Read
 */
export const AiUserDtoSchema = createSelectSchema(schema.aiUsers);

export class AiUserDto extends createZodDto(AiUserDtoSchema) {}

/**
 * Filters
 */
export const FilterAiMessagesDtoSchema = z.object({
  id: createSelectSchema(schema.aiMessages).shape.id.optional(),
  limit: z.number().optional(),
});

export class FilterAiMessagesDto extends createZodDto(
  FilterAiMessagesDtoSchema,
) {}
