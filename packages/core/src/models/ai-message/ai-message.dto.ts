import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import {
  aiMessages,
  aiUsers,
  environments,
  plotPoints,
  users,
} from "../../db/app.schema";

/**
 * Create
 */
export const CreateAiMessageDtoSchema = z.object({
  userId: createSelectSchema(users).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
  content: createInsertSchema(aiMessages).shape.content,
  state: createInsertSchema(aiMessages).shape.state,
});

export class CreateAiMessageDto extends createZodDto(
  CreateAiMessageDtoSchema,
) {}

/**
 * Read
 */
export const AiMessageDtoSchema = z.object({
  plotPoint: createSelectSchema(plotPoints).extend({
    createdAt: z.coerce.date(),
  }),
  aiMessage: createSelectSchema(aiMessages),
  environment: createSelectSchema(environments),
  aiUser: createSelectSchema(aiUsers),
});

export class AiMessageDto extends createZodDto(AiMessageDtoSchema) {}

/**
 * Update
 */
export const UpdateAiMessageDtoSchema = z.object({
  id: createSelectSchema(aiMessages).shape.id,
  content: createInsertSchema(aiMessages).shape.content.optional(),
  state: createInsertSchema(aiMessages).shape.state.optional(),
});

export class UpdateAiMessageDto extends createZodDto(
  UpdateAiMessageDtoSchema,
) {}

/**
 * Filters
 */
export const FilterAiMessagesDtoSchema = z.object({
  id: createSelectSchema(aiMessages).shape.id.optional(),
  limit: z.number().optional(),
});

export class FilterAiMessagesDto extends createZodDto(
  FilterAiMessagesDtoSchema,
) {}
