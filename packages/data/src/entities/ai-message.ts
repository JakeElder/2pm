import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import * as schema from "../schema";

export const CreateAiMessageDtoSchema = z.object({
  userId: createSelectSchema(schema.users).shape.id,
  environmentId: createSelectSchema(schema.environments).shape.id,
  content: createInsertSchema(schema.messages).shape.content,
});

export const AiMessageHydratedPlotPointDtoSchema = createSelectSchema(
  schema.plotPoints,
).extend({
  type: z.literal("AI_MESSAGE"),
  data: z.object({
    message: createSelectSchema(schema.messages),
    aiMessage: createSelectSchema(schema.aiMessages),
    user: createSelectSchema(schema.users),
    aiUser: createSelectSchema(schema.aiUsers),
    environment: createSelectSchema(schema.environments),
  }),
});

export class CreateAiMessageDto extends createZodDto(
  CreateAiMessageDtoSchema,
) {}

export class AiMessageHydratedPlotPointDto extends createZodDto(
  AiMessageHydratedPlotPointDtoSchema,
) {}

export class AiMessageCreatedEventDto extends createZodDto(
  AiMessageHydratedPlotPointDtoSchema,
) {}
