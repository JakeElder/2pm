import { createSelectSchema } from "drizzle-zod";
import { plotPoints } from "../schema";
import { z } from "zod";
import { HumanMessageHydratedPlotPointDtoSchema } from "./human-message";
import { AiMessageHydratedPlotPointDtoSchema } from "./ai-message";
import { createZodDto } from "@anatine/zod-nestjs";

export const EnvironmentEnteredHydratedPlotPointDtoSchema = createSelectSchema(
  plotPoints,
).extend({
  type: z.literal("ENVIRONMENT_ENTERED"),
  data: z.object({}),
});

export const EnvironmentLeftHydratedPlotPointDtoSchema = createSelectSchema(
  plotPoints,
).extend({
  type: z.literal("ENVIRONMENT_LEFT"),
  data: z.object({}),
});

export class EnvironmentEnteredHydratedPlotPointDto extends createZodDto(
  EnvironmentEnteredHydratedPlotPointDtoSchema,
) {}

export class EnvironmentLeftHydratedPlotPointDto extends createZodDto(
  EnvironmentLeftHydratedPlotPointDtoSchema,
) {}

export const HydratedPlotPointDtoSchema = z.discriminatedUnion("type", [
  HumanMessageHydratedPlotPointDtoSchema,
  AiMessageHydratedPlotPointDtoSchema,
  EnvironmentEnteredHydratedPlotPointDtoSchema,
  EnvironmentLeftHydratedPlotPointDtoSchema,
]);
