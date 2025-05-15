import { createZodDto } from "@anatine/zod-nestjs";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { themes } from "../../db/app.schema";

/**
 * Create
 */
export const CreateThemeDtoSchema = createInsertSchema(themes);

export class CreateThemeDto extends createZodDto(CreateThemeDtoSchema) {}

/**
 * Read
 */
export const ThemeDtoSchema = createSelectSchema(themes);

export class ThemeDto extends createZodDto(ThemeDtoSchema) {}
