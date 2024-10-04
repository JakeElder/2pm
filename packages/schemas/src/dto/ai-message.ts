import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  aiMessages,
  aiUsers,
  environments,
  messages,
  plotPoints,
  users,
} from "../drizzle/schema";
import { createZodDto } from "@anatine/zod-nestjs";

const AiMessageDtoSchema = z.object({
  plotPoint: createSelectSchema(plotPoints),
  message: createSelectSchema(messages),
  aiMessage: createSelectSchema(aiMessages),
  user: createSelectSchema(users),
  aiUser: createSelectSchema(aiUsers),
  environment: createSelectSchema(environments),
});

const CreateAiMessageDtoSchema = z.object({
  userId: createSelectSchema(users).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
  content: createInsertSchema(messages).shape.content,
});

class AiMessageDto extends createZodDto(AiMessageDtoSchema) {}
class CreateAiMessageDto extends createZodDto(CreateAiMessageDtoSchema) {}

export {
  AiMessageDtoSchema,
  AiMessageDto,
  CreateAiMessageDto,
  CreateAiMessageDtoSchema,
};
