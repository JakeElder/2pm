import { InferSelectModel } from "drizzle-orm";
import { kjvChunks } from "../../db/library.schema";

export type BibleChunk = InferSelectModel<typeof kjvChunks>;

export type BibleChunkMetadata = {
  id: number;
  range: [number, number];
  verse: number;
  book_id: number;
  chapter: number;
};
