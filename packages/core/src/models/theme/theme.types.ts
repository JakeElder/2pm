import { InferSelectModel } from "drizzle-orm";
import { themes } from "../../db/app.schema";
import { ALIAS_THEME_KEYS, THEME_KEYS } from "./theme.constants";

export type Theme = InferSelectModel<typeof themes>;
export type ThemeKey = (typeof THEME_KEYS)[number];

export type AliasThemeKey = (typeof ALIAS_THEME_KEYS)[number];
