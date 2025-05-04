import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import * as schema from "../../db/core/core.schema";
import { ProseDtoSchema } from "../prose/prose.dto";
import { HumanUserDtoSchema } from "../user";
/**
 * Create
 */
export const CreateHumanMessageDtoSchema = z.object({
  userId: createSelectSchema(schema.users).shape.id,
  environmentId: createSelectSchema(schema.environments).shape.id,
  content: ProseDtoSchema,
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
    content: ProseDtoSchema,
  }),
  environment: createSelectSchema(schema.environments),
  user: HumanUserDtoSchema,
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
