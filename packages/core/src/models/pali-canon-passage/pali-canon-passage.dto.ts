import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { paliCanonChunks } from "../../db/library.schema";
import { z } from "zod";

/**
 * Read
 */
export const PaliCanonPassageDtoSchema = createSelectSchema(paliCanonChunks);

export class PaliCanonPassageDto extends createZodDto(
  PaliCanonPassageDtoSchema,
) {}

/**
 * Query
 */
export const PaliCanonPassageVectorQueryDtoSchema = z.object({
  text: z.string(),
});

export class PaliCanonPassageVectorQueryDto extends createZodDto(
  PaliCanonPassageVectorQueryDtoSchema,
) {}
