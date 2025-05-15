import { InferSelectModel } from "drizzle-orm";
import { humanUserThemes } from "../../db/app.schema";

export type HumanUserTheme = InferSelectModel<typeof humanUserThemes>;
