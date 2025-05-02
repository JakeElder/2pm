import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import * as schema from "../../db/core/core.schema";

/**
 * Create
 */
export const CreateWorldRoomEnvironmentDtoSchema = createInsertSchema(
  schema.worldRoomEnvironments,
).pick({
  id: true,
  slug: true,
  order: true,
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
export const FilterWorldRoomEnvironmentDtoSchema = z.object({
  id: createSelectSchema(schema.worldRoomEnvironments).shape.id.optional(),
  slug: createSelectSchema(schema.worldRoomEnvironments).shape.slug.optional(),
  limit: z.coerce.number().optional(),
});

export class FilterWorldRoomEnvironmentDto extends createZodDto(
  FilterWorldRoomEnvironmentDtoSchema,
) {}
