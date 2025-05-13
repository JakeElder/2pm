import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { ProseDtoSchema } from "../prose/prose.dto";
import { HumanUserDtoSchema } from "../user";
import {
  environments,
  humanMessages,
  plotPoints,
  users,
} from "../../db/core/core.schema";

/**
 * Create
 */
export const CreateHumanMessageDtoSchema = z.object({
  userId: createSelectSchema(users).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
  json: ProseDtoSchema,
  text: createSelectSchema(humanMessages).shape.text,
});

export class CreateHumanMessageDto extends createZodDto(
  CreateHumanMessageDtoSchema,
) {}

/**
 * Read
 */
export const HumanMessageDtoSchema = z.object({
  plotPoint: createSelectSchema(plotPoints).extend({
    createdAt: z.coerce.date(),
  }),
  humanMessage: createSelectSchema(humanMessages).extend({
    json: ProseDtoSchema,
  }),
  environment: createSelectSchema(environments),
  user: HumanUserDtoSchema,
});

export class HumanMessageDto extends createZodDto(HumanMessageDtoSchema) {}

/**
 * Filters
 */
export const FilterHumanMessagesDtoSchema = z.object({
  id: createSelectSchema(humanMessages).shape.id.optional(),
  limit: z.number().optional(),
});

export class FilterHumanMessagesDto extends createZodDto(
  FilterHumanMessagesDtoSchema,
) {}
