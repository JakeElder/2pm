import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { bibleVerseReferences, environments, users } from "../../db/app.schema";
import { z } from "zod";

/**
 * Create
 */
export const CreateBibleVerseReferenceDtoSchema = z.object({
  userId: createSelectSchema(users).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
  bibleVerseId: createInsertSchema(bibleVerseReferences).shape.bibleVerseId,
  bibleChunkId: createInsertSchema(bibleVerseReferences).shape.bibleChunkId,
});

export class CreateBibleVerseReferenceDto extends createZodDto(
  CreateBibleVerseReferenceDtoSchema,
) {}

/**
 * Read
 */
export const BibleVerseReferenceDtoSchema =
  createSelectSchema(bibleVerseReferences);

export class BibleVerseReferenceDto extends createZodDto(
  BibleVerseReferenceDtoSchema,
) {}
