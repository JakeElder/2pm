import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  vector,
} from "drizzle-orm/pg-core";
import { BibleChunkMetadata } from "../models/bible-chunk/bible-chunk.types";

export const kjvChunks = pgTable("kjv_chunks", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").notNull().$type<BibleChunkMetadata>(),
  embedding: vector("embedding", { dimensions: 1024 }),
});

export const kjvBooks = pgTable("kjv_books", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

export const kjvTranslations = pgTable("kjv_translations", {
  translation: text("translation").primaryKey(),
  title: text("title"),
  license: text("license"),
});

export const kjvVerses = pgTable("kjv_verses", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").references(() => kjvBooks.id),
  chapter: integer("chapter"),
  verse: integer("verse"),
  text: text("text"),
});
