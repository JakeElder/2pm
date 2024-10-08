import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { aiUsers, users } from "../schema";
import { createZodDto } from "@anatine/zod-nestjs";

export const CreateAiUserDtoSchema = z.object({
  id: createInsertSchema(users).shape.id,
  tag: createInsertSchema(users).shape.tag,
  code: createInsertSchema(aiUsers).shape.code,
});

export const AiUserDtoSchema = z.object({
  user: createSelectSchema(users),
  aiUser: createSelectSchema(aiUsers),
});

export class AiUserDto extends createZodDto(AiUserDtoSchema) {}
export class CreateAiUserDto extends createZodDto(CreateAiUserDtoSchema) {}
