import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import {
  environments,
  humanUsers,
  humanUserThemes,
  themes,
} from "../../db/app.schema";
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
  environmentId: createSelectSchema(environments).shape.id,
  themeId: createSelectSchema(themes).shape.id,
});

export class UpdateHumanUserThemeDto extends createZodDto(
  UpdateHumanUserThemeDtoSchema,
) {}

export const ShiftHumanUserThemeDtoSchema = z.object({
  id: createSelectSchema(humanUserThemes).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
  direction: z.enum(["PREV", "NEXT"]),
});

export class ShiftHumanUserThemeDto extends createZodDto(
  ShiftHumanUserThemeDtoSchema,
) {}

export const ShiftDirectionHumanUserThemeDtoSchema =
  ShiftHumanUserThemeDtoSchema.omit({
    direction: true,
  });

export class ShiftDirectionHumanUserThemeDto extends createZodDto(
  ShiftDirectionHumanUserThemeDtoSchema,
) {}
