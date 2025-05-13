import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import * as schema from "../../db/core/core.schema";

/**
 * Create
 */
export const CreateAiMessageDtoSchema = z.object({
  userId: createSelectSchema(schema.users).shape.id,
  environmentId: createSelectSchema(schema.environments).shape.id,
  content: createInsertSchema(schema.aiMessages).shape.content,
  state: createInsertSchema(schema.aiMessages).shape.state,
});

export class CreateAiMessageDto extends createZodDto(
  CreateAiMessageDtoSchema,
) {}

/**
 * Read
 */
export const AiMessageDtoSchema = z.object({
  plotPoint: createSelectSchema(schema.plotPoints).extend({
    createdAt: z.coerce.date(),
  }),
  aiMessage: createSelectSchema(schema.aiMessages),
  environment: createSelectSchema(schema.environments),
  aiUser: createSelectSchema(schema.aiUsers),
});

export class AiMessageDto extends createZodDto(AiMessageDtoSchema) {}

/**
 * Update
 */
export const UpdateAiMessageDtoSchema = z.object({
  id: createSelectSchema(schema.aiMessages).shape.id,
  content: createInsertSchema(schema.aiMessages).shape.content.optional(),
  state: createInsertSchema(schema.aiMessages).shape.state.optional(),
});

export class UpdateAiMessageDto extends createZodDto(
  UpdateAiMessageDtoSchema,
) {}

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
