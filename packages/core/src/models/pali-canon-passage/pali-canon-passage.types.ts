import { InferSelectModel } from "drizzle-orm";
import { kjvVerses } from "../../db/library.schema";

export type PaliCanonPassage = InferSelectModel<typeof kjvVerses>;
