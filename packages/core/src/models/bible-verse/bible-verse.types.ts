import { InferSelectModel } from "drizzle-orm";
import { kjvVerses } from "../../db/library.schema";

export type BibleVerse = InferSelectModel<typeof kjvVerses>;
