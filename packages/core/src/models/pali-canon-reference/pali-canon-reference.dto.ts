import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { environments, users } from "../../db/app.schema";
import { paliCanonChunks } from "../../db/library.schema";

/**
 * Create
 */
export const CreatePaliCanonReferenceDtoSchema = z.object({
  userId: createSelectSchema(users).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
  paliCanonChunkId: createSelectSchema(paliCanonChunks).shape.id,
});

export class CreatePaliCanonReferenceDto extends createZodDto(
  CreatePaliCanonReferenceDtoSchema,
) {}
