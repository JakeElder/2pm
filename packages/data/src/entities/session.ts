import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { anonymousUsers, sessions, users } from "../schema";
import { z } from "zod";

export const CreateSessionDtoSchema = createInsertSchema(sessions);

export const AnonymousSessionDtoSchema = z.object({
  type: z.literal("ANONYMOUS"),
  data: z.object({
    session: createSelectSchema(sessions),
    user: createSelectSchema(users),
    anonymousUser: createSelectSchema(anonymousUsers),
  }),
});

export const AuthenticatedSessionDtoSchema = z.object({
  type: z.literal("AUTHENTICATED"),
  data: z.object({
    session: createSelectSchema(sessions),
    user: createSelectSchema(users),
    authenticatedUser: createSelectSchema(anonymousUsers),
  }),
});

export const FindSessionsQueryDtoSchema = z.object({
  ids: z.array(createSelectSchema(sessions).shape.id).optional(),
  limit: z.number().optional(),
});

/**
 * Dto
 */

export class CreateSessionDto extends createZodDto(CreateSessionDtoSchema) {}
export class AnonymousSessionDto extends createZodDto(
  AnonymousSessionDtoSchema,
) {}
export class AuthenticatedSessionDto extends createZodDto(
  AuthenticatedSessionDtoSchema,
) {}
export class FindSessionsQueryDto extends createZodDto(
  FindSessionsQueryDtoSchema,
) {}

/**
 * Union
 */
export const SessionDtoSchema = z.discriminatedUnion("type", [
  AnonymousSessionDtoSchema,
  AuthenticatedSessionDtoSchema,
]);

/**
 * Types
 */
export type SessionDto = z.infer<typeof SessionDtoSchema>;
