import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { environments, users } from "../../db/app.schema";
import { createZodDto } from "@anatine/zod-nestjs";

/**
 * Create
 */
export const CreateHumanPostDtoSchema = z.object({
  userId: createSelectSchema(users).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
});

export class CreateHumanPostDto extends createZodDto(
  CreateHumanPostDtoSchema,
) {}
