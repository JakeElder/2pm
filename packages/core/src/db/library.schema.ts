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

export const paliCanonAuthors = pgTable("pali_canon_authors", {
  authorUid: text("author_uid").primaryKey(),
  authorShort: text("author_short"),
  author: text("author"),
});

export const paliCanonChunks = pgTable("pali_canon_chunks", {
  id: serial("id").primaryKey().notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").notNull().$type<Record<string, any>>(),
  embedding: vector("embedding", { dimensions: 1024 }),
});

export const paliCanonLanguages = pgTable("pali_canon_languages", {
  lang: text("lang").primaryKey(),
  langName: text("lang_name"),
});

export const paliCanonTextInfos = pgTable("pali_canon_text_infos", {
  uid: text("uid").primaryKey(),
  parentUid: text("parent_uid"),
  blurb: text("blurb"),
  originalTitle: text("original_title"),
  translatedTitle: text("translated_title"),
  acronym: text("acronym"),
  difficulty: text("difficulty"),
  basket: text("basket"),
  rootLangName: text("root_lang_name"),
  rootLang: text("root_lang"),
  type: text("type"),
});

export const paliCanonTranslations = pgTable("pali_canon_translations", {
  translationId: text("translation_id").primaryKey(),
  uid: text("uid"),
  lang: text("lang"),
  authorUid: text("author_uid"),
  localFilePath: text("local_file_path"),
  basket: text("basket"),
  textContent: text("text_content"),
});
