import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { kjvBooks, kjvChunks, kjvVerses } from "../../db/library.schema";
import { z } from "zod";

/**
 * Read
 */
export const BibleVerseDtoSchema = z.object({
  bibleVerse: createSelectSchema(kjvVerses),
  bibleBook: createSelectSchema(kjvBooks),
});

export class BibleVerseDto extends createZodDto(BibleVerseDtoSchema) {}

/**
 * Query
 */
export const BibleVerseVectorQueryDtoSchema = z.object({
  text: z.string(),
});

export class BibleVerseVectorQueryDto extends createZodDto(
  BibleVerseVectorQueryDtoSchema,
) {}

/**
 * Result
 */
export const BibleVerseVectorQueryResultDtoSchema = z.object({
  query: z.string(),
  results: z.array(
    z.object({
      verse: createSelectSchema(kjvVerses),
      book: createSelectSchema(kjvBooks),
      chunkId: createSelectSchema(kjvChunks).shape.id,
    }),
  ),
});

export class BibleVerseVectorQueryResultDto extends createZodDto(
  BibleVerseVectorQueryResultDtoSchema,
) {}
