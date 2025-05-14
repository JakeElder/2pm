import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { HumanMessageDtoSchema } from "../human-message/human-message.dto";
import { AiMessageDtoSchema } from "../ai-message/ai-message.dto";
import { PLOT_POINT_TYPES } from "./plot-point.constants";
import { UserEnvironmentPresenceStateSchema } from "../user-environment-presence";
import { BibleVerseDtoSchema } from "../bible-verse/bible-verse.dto";
import { BibleChunkDtoSchema } from "../bible-chunk/bible-chunk.dto";
import { EnvironmentDtoSchema } from "../environment";
import { createSelectSchema } from "drizzle-zod";
import { environments, plotPoints } from "../../db/app.schema";
import { kjvChunks, kjvVerses } from "../../db/library.schema";

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
  data: UserEnvironmentPresenceStateSchema,
});

export class EnvironmentEnteredPlotPointDto extends createZodDto(
  EnvironmentEnteredPlotPointDtoSchema,
) {}

/**
 * Environment Left
 */
export const EnvironmentLeftPlotPointDtoSchema = z.object({
  type: z.literal("ENVIRONMENT_LEFT"),
  data: UserEnvironmentPresenceStateSchema,
});

export class EnvironmentLeftPlotPointDto extends createZodDto(
  EnvironmentLeftPlotPointDtoSchema,
) {}

/**
 * Bible Verse
 */
export const BibleVerseReferencePlotPointDtoSchema = z.object({
  type: z.literal("BIBLE_VERSE_REFERENCE"),
  data: z.object({
    plotPoint: createSelectSchema(plotPoints).extend({
      createdAt: z.coerce.date(),
    }),
    environment: createSelectSchema(environments),
    bibleVerse: createSelectSchema(kjvVerses),
    bibleChunk: createSelectSchema(kjvChunks).omit({ embedding: true }),
  }),
});

export class BibleVerseReferencePlotPointDto extends createZodDto(
  BibleVerseReferencePlotPointDtoSchema,
) {}

/**
 * Union
 */
export const PlotPointDtoSchema = z.discriminatedUnion("type", [
  HumanMessagePlotPointDtoSchema,
  AiMessagePlotPointDtoSchema,
  EnvironmentEnteredPlotPointDtoSchema,
  EnvironmentLeftPlotPointDtoSchema,
  BibleVerseReferencePlotPointDtoSchema,
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
  reverse: z.coerce.boolean().optional(),
});

export class FilterPlotPointsDto extends createZodDto(
  FilterPlotPointsDtoSchema,
) {}
