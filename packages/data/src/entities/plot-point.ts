import { z } from "zod";
import * as schema from "../schema";
import { createZodDto } from "@anatine/zod-nestjs";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { AiMessageDtoSchema, HumanMessageDtoSchema } from "./message";
import type { PLOT_POINT_TYPES } from "../constants";

/**
 * Human Message
 */
export const HumanMessagePlotPointDtoSchema = z.object({
  type: z.literal("HUMAN_MESSAGE"),
  data: HumanMessageDtoSchema,
});

export const HumanMessagePlotPointSummaryDtoSchema = z.object({
  type: z.literal("HUMAN_MESSAGE"),
  data: z.object({
    user: z.object({
      type: z.literal("HUMAN"),
      id: createSelectSchema(schema.users).shape.id,
      tag: createSelectSchema(schema.humanUsers).shape.tag,
    }),
    message: z.object({
      id: createSelectSchema(schema.messages).shape.id,
      content: createSelectSchema(schema.humanMessages).shape.content,
    }),
  }),
});

export const CreateHumanMessagePlotPointDtoSchema = z.object({
  type: z.literal("HUMAN_MESSAGE"),
  userId: createSelectSchema(schema.users).shape.id,
  environmentId: createSelectSchema(schema.environments).shape.id,
  content: createSelectSchema(schema.humanMessages).shape.content,
});

export class HumanMessagePlotPointDto extends createZodDto(
  HumanMessagePlotPointDtoSchema,
) {}

export class HumanMessagePlotPointSummaryDto extends createZodDto(
  HumanMessagePlotPointSummaryDtoSchema,
) {}

export class CreateHumanMessagePlotPointDto extends createZodDto(
  CreateHumanMessagePlotPointDtoSchema,
) {}

/**
 * Ai Message
 */
export const AiMessagePlotPointDtoSchema = z.object({
  type: z.literal("AI_MESSAGE"),
  data: AiMessageDtoSchema,
});

export const AiMessagePlotPointSummaryDtoSchema = z.object({
  type: z.literal("AI_MESSAGE"),
  data: z.object({
    user: z.object({
      type: z.literal("AI"),
      id: createSelectSchema(schema.users).shape.id,
      tag: createSelectSchema(schema.aiUsers).shape.tag,
    }),
    message: z.object({
      id: createSelectSchema(schema.messages).shape.id,
      state: createSelectSchema(schema.aiMessages).shape.state,
      content: createSelectSchema(schema.aiMessages).shape.content,
    }),
  }),
});

export const CreateAiMessagePlotPointDtoSchema = z.object({
  type: z.literal("AI_MESSAGE"),
  userId: createSelectSchema(schema.users).shape.id,
  environmentId: createSelectSchema(schema.environments).shape.id,
  content: createInsertSchema(schema.aiMessages).shape.content,
  state: createInsertSchema(schema.aiMessages).shape.state,
});

export class AiMessagePlotPointDto extends createZodDto(
  AiMessagePlotPointDtoSchema,
) {}

export class AiMessagePlotPointSummaryDto extends createZodDto(
  AiMessagePlotPointSummaryDtoSchema,
) {}

export class CreateAiMessagePlotPointDto extends createZodDto(
  CreateAiMessagePlotPointDtoSchema,
) {}

/**
 * Unions
 */
export const PlotPointDtoSchema = z.discriminatedUnion("type", [
  HumanMessagePlotPointDtoSchema,
  AiMessagePlotPointDtoSchema,
]);

export const PlotPointSummaryDtoSchema = z.discriminatedUnion("type", [
  HumanMessagePlotPointSummaryDtoSchema,
  AiMessagePlotPointSummaryDtoSchema,
]);

export const CreatePlotPointDtoSchema = z.discriminatedUnion("type", [
  CreateHumanMessagePlotPointDtoSchema,
  CreateAiMessagePlotPointDtoSchema,
]);

/**
 * Types
 */
export type CreatePlotPointDto = z.infer<typeof CreatePlotPointDtoSchema>;
export type PlotPointDto = z.infer<typeof PlotPointDtoSchema>;
export type PlotPointSummaryDto = z.infer<typeof PlotPointSummaryDtoSchema>;

type PlotPointDtoMap = {
  HUMAN_MESSAGE: HumanMessagePlotPointDto;
  AI_MESSAGE: AiMessagePlotPointDto;
};

export type InferPlotPointDto<
  T extends { type: (typeof PLOT_POINT_TYPES)[number] },
> = T extends {
  type: keyof PlotPointDtoMap;
}
  ? PlotPointDtoMap[T["type"]]
  : never;
