import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { plotPoints, messages, environments } from "../drizzle/schema";
import type { Z } from "..";

const SelectPlotPointSchema = createSelectSchema(plotPoints);

const MessageSentPlotPointSchema = SelectPlotPointSchema.extend({
  type: z.literal("MESSAGE_SENT"),
  message: createSelectSchema(messages),
});

const EnvironmentEnteredPlotPointSchema = SelectPlotPointSchema.extend({
  type: z.literal("ENVIRONMENT_ENTERED"),
  environment: createSelectSchema(environments),
});

const PlotPointSchema = z.discriminatedUnion("type", [
  MessageSentPlotPointSchema,
  EnvironmentEnteredPlotPointSchema,
]);

type PlotPoint = Z<typeof PlotPointSchema>;

export { PlotPointSchema, type PlotPoint };
