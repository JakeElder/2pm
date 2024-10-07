import { createSelectSchema } from "drizzle-zod";
import { plotPoints } from "../schema";
import { AiMessageDtoSchema, HumanMessageDtoSchema } from ".";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";

const PlotPointSchema = createSelectSchema(plotPoints);

const HumanMessageHydratedPlotPointDtoSchema = PlotPointSchema.extend({
  type: z.literal("HUMAN_MESSAGE"),
  data: HumanMessageDtoSchema.omit({ plotPoint: true }),
});

const AiMessageHydratedPlotPointDtoSchema = PlotPointSchema.extend({
  type: z.literal("AI_MESSAGE"),
  data: AiMessageDtoSchema.omit({ plotPoint: true }),
});

const EnvironmentEnteredHydratedPlotPointDtoSchema = PlotPointSchema.extend({
  type: z.literal("ENVIRONMENT_ENTERED"),
  data: z.object({}),
});

const EnvironmentLeftHydratedPlotPointDtoSchema = PlotPointSchema.extend({
  type: z.literal("ENVIRONMENT_LEFT"),
  data: z.object({}),
});

const HydratedPlotPointDtoSchema = z.discriminatedUnion("type", [
  HumanMessageHydratedPlotPointDtoSchema,
  AiMessageHydratedPlotPointDtoSchema,
  EnvironmentEnteredHydratedPlotPointDtoSchema,
  EnvironmentLeftHydratedPlotPointDtoSchema,
]);

class HydratedPlotPointDto extends createZodDto(HydratedPlotPointDtoSchema) {}

class HumanMessageHydratedPlotPointDto extends createZodDto(
  HumanMessageHydratedPlotPointDtoSchema,
) {}

class AiMessageHydratedPlotPointDto extends createZodDto(
  AiMessageHydratedPlotPointDtoSchema,
) {}

class EnvironmentEnteredHydratedPlotPointDto extends createZodDto(
  EnvironmentEnteredHydratedPlotPointDtoSchema,
) {}

class EnvironmentLeftHydratedPlotPointDto extends createZodDto(
  EnvironmentLeftHydratedPlotPointDtoSchema,
) {}

export {
  HydratedPlotPointDtoSchema,
  HumanMessageHydratedPlotPointDtoSchema,
  AiMessageHydratedPlotPointDtoSchema,
  EnvironmentEnteredHydratedPlotPointDtoSchema,
  EnvironmentLeftHydratedPlotPointDtoSchema,
  HydratedPlotPointDto,
  HumanMessageHydratedPlotPointDto,
  AiMessageHydratedPlotPointDto,
  EnvironmentEnteredHydratedPlotPointDto,
  EnvironmentLeftHydratedPlotPointDto,
};
