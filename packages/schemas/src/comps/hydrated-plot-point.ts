import { createSelectSchema } from "drizzle-zod";
import { plotPoints } from "../drizzle/schema";
import { AiMessageDtoSchema, HumanMessageDtoSchema } from "../dto";
import { z } from "zod";
import type { Z } from "..";

const PlotPointSchema = createSelectSchema(plotPoints);

const HumanMessageHydratedPlotPointSchema = PlotPointSchema.extend({
  type: z.literal("HUMAN_MESSAGE"),
  data: HumanMessageDtoSchema.omit({ plotPoint: true }),
});

const AiMessageHydratedPlotPointSchema = PlotPointSchema.extend({
  type: z.literal("AI_MESSAGE"),
  data: AiMessageDtoSchema.omit({ plotPoint: true }),
});

const EnvironmentEnteredHydratedPlotPointSchema = PlotPointSchema.extend({
  type: z.literal("ENVIRONMENT_ENTERED"),
  data: z.object({}),
});

const EnvironmentLeftHydratedPlotPointSchema = PlotPointSchema.extend({
  type: z.literal("ENVIRONMENT_LEFT"),
  data: z.object({}),
});

const HydratedPlotPointSchema = z.discriminatedUnion("type", [
  HumanMessageHydratedPlotPointSchema,
  AiMessageHydratedPlotPointSchema,
  EnvironmentEnteredHydratedPlotPointSchema,
  EnvironmentLeftHydratedPlotPointSchema,
]);

type HydratedPlotPoint = Z<typeof HydratedPlotPointSchema>;
type HumanMessageHydratedPlotPoint = Z<
  typeof HumanMessageHydratedPlotPointSchema
>;
type AiMessageHydratedPlotPoint = Z<typeof AiMessageHydratedPlotPointSchema>;
type EnvironmentEnteredHydratedPlotPoint = Z<
  typeof EnvironmentEnteredHydratedPlotPointSchema
>;
type EnvironmentLeftHydratedPlotPoint = Z<
  typeof EnvironmentLeftHydratedPlotPointSchema
>;

export {
  HydratedPlotPointSchema,
  type HydratedPlotPoint,
  type EnvironmentEnteredHydratedPlotPoint,
  type EnvironmentLeftHydratedPlotPoint,
  type HumanMessageHydratedPlotPoint,
  type AiMessageHydratedPlotPoint,
};
