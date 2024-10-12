import { z } from "zod";
import { AiMessageDtoSchema, HumanMessageDtoSchema } from "./message";
import { createZodDto } from "@anatine/zod-nestjs";

export const AiMessageHydratedPlotPointDtoSchema = z.object({
  type: z.literal("AI_MESSAGE"),
  data: AiMessageDtoSchema,
});

export const HumanMessageHydratedPlotPointDtoSchema = z.object({
  type: z.literal("HUMAN_MESSAGE"),
  data: HumanMessageDtoSchema,
});

export const HydratedPlotPointDtoSchema = z.discriminatedUnion("type", [
  HumanMessageHydratedPlotPointDtoSchema,
  AiMessageHydratedPlotPointDtoSchema,
]);

export class HumanMessageHydratedPlotPointDto extends createZodDto(
  HumanMessageHydratedPlotPointDtoSchema,
) {}
export class AiMessageHydratedPlotPointDto extends createZodDto(
  AiMessageHydratedPlotPointDtoSchema,
) {}

export type HydratedPlotPointDto = z.infer<typeof HydratedPlotPointDtoSchema>;
