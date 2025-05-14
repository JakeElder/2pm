import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { kjvVerses } from "../../db/library.schema";
import { z } from "zod";

/**
 * Read
 */
export const BibleVerseDtoSchema = createSelectSchema(kjvVerses);

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
