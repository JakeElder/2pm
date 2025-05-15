import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { humanUsers, humanUserThemes, themes } from "../../db/app.schema";
import { HumanUserDtoSchema } from "../user/user.dto";

/**
 * Create
 */
export const CreateHumanUserThemeDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
  themeId: createSelectSchema(themes).shape.id,
});

export class CreateHumanUserThemeDto extends createZodDto(
  CreateHumanUserThemeDtoSchema,
) {}

/**
 * Read
 */
export const HumanUserThemeDtoSchema = z.object({
  id: createSelectSchema(humanUserThemes).shape.id,
  humanUser: HumanUserDtoSchema,
  theme: createSelectSchema(themes),
});

export class HumanUserThemeDto extends createZodDto(HumanUserThemeDtoSchema) {}

/**
 * Update
 */
export const UpdateHumanUserThemeDtoSchema = z.object({
  id: createSelectSchema(humanUserThemes).shape.id,
  humanUserId: createSelectSchema(humanUsers).shape.id.optional(),
  themeId: createSelectSchema(themes).shape.id.optional(),
});

export class UpdateHumanUserThemeDto extends createZodDto(
  UpdateHumanUserThemeDtoSchema,
) {}
