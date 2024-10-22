import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { anonymousUsers, authenticatedUsers, sessions, users } from "../schema";
import { z } from "zod";

/**
 * Anonymous Session
 */

export const AnonymousSessionDtoSchema = z.object({
  type: z.literal("ANONYMOUS"),
  data: z.object({
    session: createSelectSchema(sessions),
    user: createSelectSchema(users),
    anonymousUser: createSelectSchema(anonymousUsers),
  }),
});

export const CreateAnonymousSessionDtoSchema = z.object({
  type: z.literal("ANONYMOUS"),
  userId: createSelectSchema(users).shape.id,
});

export class AnonymousSessionDto extends createZodDto(
  AnonymousSessionDtoSchema,
) {}
export class CreateAnonymousSessionDto extends createZodDto(
  CreateAnonymousSessionDtoSchema,
) {}

/**
 * Authenticated Session
 */

export const AuthenticatedSessionDtoSchema = z.object({
  type: z.literal("AUTHENTICATED"),
  data: z.object({
    session: createSelectSchema(sessions),
    user: createSelectSchema(users),
    authenticatedUser: createSelectSchema(authenticatedUsers),
  }),
});

export const CreateAuthenticatedSessionDtoSchema = z.object({
  type: z.literal("AUTHENTICATED"),
  userId: createSelectSchema(users).shape.id,
});

export class AuthenticatedSessionDto extends createZodDto(
  AuthenticatedSessionDtoSchema,
) {}

/**
 * Queries
 */

export const FindSessionsQueryDtoSchema = z.object({
  ids: z.array(createSelectSchema(sessions).shape.id).optional(),
  limit: z.number().optional(),
});

export class FindSessionsQueryDto extends createZodDto(
  FindSessionsQueryDtoSchema,
) {}

/**
 * Unions
 */
export const SessionDtoSchema = z.discriminatedUnion("type", [
  AnonymousSessionDtoSchema,
  AuthenticatedSessionDtoSchema,
]);

export const CreateSessionDtoSchema = z.discriminatedUnion("type", [
  CreateAnonymousSessionDtoSchema,
  CreateAuthenticatedSessionDtoSchema,
]);

/**
 * Types
 */
export type CreateSessionDto = z.infer<typeof CreateSessionDtoSchema>;
export type SessionDto = z.infer<typeof SessionDtoSchema>;

type SessionDtoMap = {
  ANONYMOUS: AnonymousSessionDto;
  AUTHENTICATED: AuthenticatedSessionDto;
};

export type InferSessionDto<T extends CreateSessionDto> = T extends {
  type: keyof SessionDtoMap;
}
  ? SessionDtoMap[T["type"]]
  : never;
