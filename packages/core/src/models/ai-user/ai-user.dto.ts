import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { aiUsers } from "../../db/app/app.schema";

/**
 * Create
 */
export const CreateAiUserDtoSchema = createInsertSchema(aiUsers).omit({
  userId: true,
});

export class CreateAiUserDto extends createZodDto(CreateAiUserDtoSchema) {}

/**
 * Read
 */

export const AiUserDtoSchema = createSelectSchema(aiUsers);

export class AiUserDto extends createZodDto(AiUserDtoSchema) {}
