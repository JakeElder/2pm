import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { kjvChunks } from "../../db/library.schema";

/**
 * Read
 */
export const BibleChunkDtoSchema = createSelectSchema(kjvChunks);

export class BibleChunkDto extends createZodDto(BibleChunkDtoSchema) {}
