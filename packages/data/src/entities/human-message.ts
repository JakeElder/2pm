import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import * as schema from "../schema";

export const CreateHumanMessageDtoSchema = z.object({
  userId: createSelectSchema(schema.users).shape.id,
  environmentId: createSelectSchema(schema.environments).shape.id,
  content: createSelectSchema(schema.humanMessages).shape.content,
});

export const HumanMessageHydratedPlotPointDtoSchema = createSelectSchema(
  schema.plotPoints,
).extend({
  type: z.literal("HUMAN_MESSAGE"),
  data: z.object({
    message: createSelectSchema(schema.messages),
    humanMessage: createSelectSchema(schema.humanMessages),
    user: createSelectSchema(schema.users),
    humanUser: createSelectSchema(schema.humanUsers),
    environment: createSelectSchema(schema.environments),
  }),
});

export class CreateHumanMessageDto extends createZodDto(
  CreateHumanMessageDtoSchema,
) {}

export class HumanMessageHydratedPlotPointDto extends createZodDto(
  HumanMessageHydratedPlotPointDtoSchema,
) {}

export class HumanMessageCreatedEventDto extends createZodDto(
  HumanMessageHydratedPlotPointDtoSchema,
) {}
