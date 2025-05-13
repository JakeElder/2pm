import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { createSelectSchema } from "drizzle-zod";
import { humanUsers } from "../../db/core/core.schema";
import { AiUserDtoSchema } from "../ai-user/ai-user.dto";

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
 * Unions
 */
export const UserDtoSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("AI"), data: AiUserDtoSchema }),
  AnonymousUserDtoSchema,
  AuthenticatedUserDtoSchema,
]);

export const HumanUserDtoSchema = z.discriminatedUnion("type", [
  AnonymousUserDtoSchema,
  AuthenticatedUserDtoSchema,
]);
