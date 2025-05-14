import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { kjvVerses } from "../../db/library.schema";

/**
 * Read
 */
export const BibleVerseDtoSchema = createSelectSchema(kjvVerses);

export class BibleVerseDto extends createZodDto(BibleVerseDtoSchema) {}
