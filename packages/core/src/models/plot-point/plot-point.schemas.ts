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

/**
 * Human Message
 */
export const HumanMessagePlotPointSchema = z.object({
  type: z.literal("HUMAN_MESSAGE"),
  data: HumanMessageDtoSchema,
});

/**
 * Ai Message
 */
export const AiMessagePlotPointSchema = z.object({
  type: z.literal("AI_MESSAGE"),
  data: AiMessageDtoSchema,
});

/**
 * Environment Entered
 */
export const EnvironmentEnteredPlotPointDtoSchema = z.object({
  type: z.literal("ENVIRONMENT_ENTERED"),
  data: z.object({
    plotPoint: createSelectSchema(plotPoints),
    environment: createSelectSchema(environments),
    user: createSelectSchema(users),
    humanUser: createSelectSchema(humanUsers).nullable(),
    aiUser: createSelectSchema(aiUsers).nullable(),
  }),
});

/**
 * Union
 */
export const PlotPointSchema = z.discriminatedUnion("type", [
  HumanMessagePlotPointSchema,
  AiMessagePlotPointSchema,
  EnvironmentEnteredPlotPointDtoSchema,
]);
