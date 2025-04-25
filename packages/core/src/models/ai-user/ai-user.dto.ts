import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import * as schema from "../../db/schema";

/**
 * Create
 */
export const CreateAiUserDtoSchema = createInsertSchema(schema.aiUsers).omit({
  userId: true,
});

export class CreateAiUserDto extends createZodDto(CreateAiUserDtoSchema) {}

/**
 * Read
 */
export const AiUserDtoSchema = createSelectSchema(schema.aiUsers);

export class AiUserDto extends createZodDto(AiUserDtoSchema) {}
