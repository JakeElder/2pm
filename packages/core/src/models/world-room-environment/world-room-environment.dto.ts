import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { worldRoomEnvironments } from "../../db/app/app.schema";

/**
 * Create
 */
export const CreateWorldRoomEnvironmentDtoSchema = createInsertSchema(
  worldRoomEnvironments,
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
  worldRoomEnvironments,
);

export class WorldRoomEnvironmentDto extends createZodDto(
  WorldRoomEnvironmentDtoSchema,
) {}

/**
 * Filters
 */
export const FilterWorldRoomEnvironmentDtoSchema = z.object({
  id: createSelectSchema(worldRoomEnvironments).shape.id.optional(),
  slug: createSelectSchema(worldRoomEnvironments).shape.slug.optional(),
  limit: z.coerce.number().optional(),
});

export class FilterWorldRoomEnvironmentDto extends createZodDto(
  FilterWorldRoomEnvironmentDtoSchema,
) {}
