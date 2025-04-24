import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import * as schema from "../../db/schema";

/**
 * Create
 */
export const CreatePlotPointDtoSchema = createInsertSchema(schema.plotPoints);

export class CreatePlotPointDto extends createZodDto(
  CreatePlotPointDtoSchema,
) {}

/**
 * Read
 */
export const PlotPointDtoSchema = createSelectSchema(schema.plotPoints);

export class PlotPointDto extends createZodDto(PlotPointDtoSchema) {}

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
