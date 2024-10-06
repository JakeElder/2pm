import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { aiUsers, users } from "../schema";
import { createZodDto } from "@anatine/zod-nestjs";

const AiUserDtoSchema = z.object({
  user: createSelectSchema(users),
  aiUser: createSelectSchema(aiUsers),
});

const CreateAiUserDtoSchema = z.object({
  id: createInsertSchema(users).shape.id,
  tag: createInsertSchema(users).shape.tag,
  code: createInsertSchema(aiUsers).shape.code,
});

class AiUserDto extends createZodDto(AiUserDtoSchema) {}
class CreateAiUserDto extends createZodDto(CreateAiUserDtoSchema) {}

export { AiUserDtoSchema, AiUserDto, CreateAiUserDto, CreateAiUserDtoSchema };
