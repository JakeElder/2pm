import { createZodDto } from "@anatine/zod-nestjs";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { environments, themes, users } from "../../db/app.schema";

/**
 * Create
 */
export const CreateDefaultThemeDtoSchema = createInsertSchema(themes);

export class CreateDefaultThemeDto extends createZodDto(
  CreateDefaultThemeDtoSchema,
) {}

export const CreateThemeDtoSchema = createInsertSchema(themes).extend({
  environmentId: createSelectSchema(environments).shape.id,
  userId: createSelectSchema(users).shape.id,
});

export class CreateThemeDto extends createZodDto(CreateThemeDtoSchema) {}

/**
 * Read
 */
export const ThemeDtoSchema = createSelectSchema(themes);

export class ThemeDto extends createZodDto(ThemeDtoSchema) {}

/**
 * Update
 */

export const UpdateThemeDtoSchema = createUpdateSchema(themes).extend({
  environmentId: createSelectSchema(environments).shape.id,
  userId: createSelectSchema(users).shape.id,
  id: createSelectSchema(themes).shape.id,
});

export class UpdateThemeDto extends createZodDto(UpdateThemeDtoSchema) {}
