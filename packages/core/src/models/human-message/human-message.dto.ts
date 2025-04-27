import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import * as schema from "../../db/core/core.schema";
import { ProseSchema } from "../prose";

/**
 * Create
 */
export const CreateHumanMessageDtoSchema = z.object({
  userId: createSelectSchema(schema.users).shape.id,
  environmentId: createSelectSchema(schema.environments).shape.id,
  content: createInsertSchema(schema.humanMessages).shape.content,
});

export class CreateHumanMessageDto extends createZodDto(
  CreateHumanMessageDtoSchema,
) {}

/**
 * Read
 */
export const HumanMessageDtoSchema = z.object({
  plotPoint: createSelectSchema(schema.plotPoints).extend({
    createdAt: z.coerce.date(),
  }),
  humanMessage: createSelectSchema(schema.humanMessages).extend({
    content: ProseSchema,
  }),
  environment: createSelectSchema(schema.environments),
  humanUser: createSelectSchema(schema.humanUsers),
});

export class HumanMessageDto extends createZodDto(HumanMessageDtoSchema) {}

/**
 * Filters
 */
export const FilterHumanMessagesDtoSchema = z.object({
  id: createSelectSchema(schema.humanMessages).shape.id.optional(),
  limit: z.number().optional(),
});

export class FilterHumanMessagesDto extends createZodDto(
  FilterHumanMessagesDtoSchema,
) {}
