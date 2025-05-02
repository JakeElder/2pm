import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { createSelectSchema } from "drizzle-zod";
import { aiUsers, humanUsers } from "../../db/core/core.schema";

/**
 * Ai
 */
export const AiUserDtoSchema = z.object({
  type: z.literal("AI"),
  data: createSelectSchema(aiUsers),
});

export class AiUserDto extends createZodDto(AiUserDtoSchema) {}

/**
 * Anonymous
 */
export const AnonymousUserDtoSchema = z.object({
  type: z.literal("ANONYMOUS"),
  data: createSelectSchema(humanUsers)
    .omit({ tag: true })
    .extend({ hash: z.string() }),
});

export class AnonymousUserDto extends createZodDto(AnonymousUserDtoSchema) {}

/**
 * Authenticated
 */
export const AuthenticatedUserDtoSchema = z.object({
  type: z.literal("AUTHENTICATED"),
  data: createSelectSchema(humanUsers).extend({
    hash: z.string(),
  }),
});

export class AuthenticatedUserDto extends createZodDto(
  AuthenticatedUserDtoSchema,
) {}

/**
 * Union
 */

export const UserDtoSchema = z.discriminatedUnion("type", [
  AiUserDtoSchema,
  AnonymousUserDtoSchema,
  AuthenticatedUserDtoSchema,
]);
