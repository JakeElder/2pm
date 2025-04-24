import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import * as schema from "../../db/schema";

/**
 * Create
 */
export const CreateWorldRoomEnvironmentDtoSchema = z.object({
  id: createInsertSchema(schema.worldRoomEnvironments).shape.id,
});

export class CreateWorldRoomEnvironmentDto extends createZodDto(
  CreateWorldRoomEnvironmentDtoSchema,
) {}

/**
 * Read
 */
export const WorldRoomEnvironmentDtoSchema = createSelectSchema(
  schema.worldRoomEnvironments,
);

export class WorldRoomEnvironmentDto extends createZodDto(
  WorldRoomEnvironmentDtoSchema,
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
