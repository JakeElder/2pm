import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { HumanMessageDtoSchema } from "../human-message/human-message.dto";
import { AiMessageDtoSchema } from "../ai-message/ai-message.dto";
import { createSelectSchema } from "drizzle-zod";
import {
  aiUsers,
  environments,
  humanUsers,
  plotPoints,
  users,
} from "../../db/core/core.schema";
import { PLOT_POINT_TYPES } from "./plot-point.constants";
import { UserDtoSchema } from "../user/user.dto";

/**
 * Human Message
 */
export const HumanMessagePlotPointDtoSchema = z.object({
  type: z.literal("HUMAN_MESSAGE"),
  data: HumanMessageDtoSchema,
});

export class HumanMessagePlotPointDto extends createZodDto(
  HumanMessagePlotPointDtoSchema,
) {}

/**
 * Ai Message
 */
export const AiMessagePlotPointDtoSchema = z.object({
  type: z.literal("AI_MESSAGE"),
  data: AiMessageDtoSchema,
});

export class AiMessagePlotPointDto extends createZodDto(
  AiMessagePlotPointDtoSchema,
) {}

/**
 * Environment Entered
 */
export const EnvironmentEnteredPlotPointDtoSchema = z.object({
  type: z.literal("ENVIRONMENT_ENTERED"),
  data: z.object({
    plotPoint: createSelectSchema(plotPoints).extend({
      createdAt: z.coerce.date(),
    }),
    environment: createSelectSchema(environments),
    user: UserDtoSchema,
  }),
});

export class EnvironmentEnteredPlotPointDto extends createZodDto(
  EnvironmentEnteredPlotPointDtoSchema,
) {}

/**
 * Environment Left
 */
export const EnvironmentLeftPlotPointDtoSchema = z.object({
  type: z.literal("ENVIRONMENT_LEFT"),
  data: z.object({
    plotPoint: createSelectSchema(plotPoints).extend({
      createdAt: z.coerce.date(),
    }),
    environment: createSelectSchema(environments),
    user: UserDtoSchema,
  }),
});

export class EnvironmentLeftPlotPointDto extends createZodDto(
  EnvironmentLeftPlotPointDtoSchema,
) {}

/**
 * Union
 */
export const PlotPointDtoSchema = z.discriminatedUnion("type", [
  HumanMessagePlotPointDtoSchema,
  AiMessagePlotPointDtoSchema,
  EnvironmentEnteredPlotPointDtoSchema,
  EnvironmentLeftPlotPointDtoSchema,
]);

export type PlotPointDto = z.infer<typeof PlotPointDtoSchema>;

/**
 * Filters
 */

const TypesArraySchema = z.preprocess(
  (val) => (val ? (Array.isArray(val) ? val : [val]) : undefined),
  z.array(z.enum(PLOT_POINT_TYPES)),
);

export const FilterPlotPointsDtoSchema = z.object({
  limit: z.coerce.number().optional(),
  types: TypesArraySchema.optional(),
  filter: TypesArraySchema.optional(),
});

export class FilterPlotPointsDto extends createZodDto(
  FilterPlotPointsDtoSchema,
) {}
