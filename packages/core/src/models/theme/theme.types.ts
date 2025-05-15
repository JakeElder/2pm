import { InferSelectModel } from "drizzle-orm";
import { themes } from "../../db/app.schema";
import { THEME_KEYS } from "./theme.constants";

export type Theme = InferSelectModel<typeof themes>;
export type ThemeKey = (typeof THEME_KEYS)[number];
