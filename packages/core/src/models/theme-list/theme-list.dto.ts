import { createSelectSchema } from "drizzle-zod";
import { environments, themes, users } from "../../db/app.schema";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";

/**
 * Create
 */
export const CreateThemeListDtoSchema = z.object({
  themeIds: z.array(createSelectSchema(themes).shape.id),
  userId: createSelectSchema(users).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
});

export class CreateThemeListDto extends createZodDto(
  CreateThemeListDtoSchema,
) {}
