import { createInsertSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import * as schema from "../../db/core/core.schema";

/**
 * Create
 */
export const CreateAiUserDtoSchema = createInsertSchema(schema.aiUsers).omit({
  userId: true,
});

export class CreateAiUserDto extends createZodDto(CreateAiUserDtoSchema) {}
