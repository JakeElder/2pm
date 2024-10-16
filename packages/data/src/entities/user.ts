import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import {
  aiUsers,
  environments,
  authenticatedUsers,
  users,
  anonymousUsers,
} from "../schema";

/**
 * Anonymous User
 */

export const AnonymousUserDtoSchema = z.object({
  type: z.literal("ANONYMOUS"),
  data: z.object({
    user: createSelectSchema(users),
    anonymousUser: createSelectSchema(anonymousUsers),
  }),
});

export const CreateAnonymousUserDtoSchema = z.object({
  type: z.literal("ANONYMOUS"),
  id: createInsertSchema(users).shape.id,
  locationEnvironmentId: createSelectSchema(environments).shape.id,
});

export class AnonymousUserDto extends createZodDto(AnonymousUserDtoSchema) {}
export class CreateAnonymousUserDto extends createZodDto(
  CreateAnonymousUserDtoSchema,
) {}

/**
 * Authenticated User
 */

export const CreateAuthenticatedUserDtoSchema = z.object({
  type: z.literal("AUTHENTICATED"),
  id: createInsertSchema(users).shape.id,
  tag: createInsertSchema(authenticatedUsers).shape.tag,
  locationEnvironmentId: createSelectSchema(environments).shape.id,
});

export const AuthenticatedUserDtoSchema = z.object({
  type: z.literal("AUTHENTICATED"),
  id: createSelectSchema(users).shape.id,
  tag: createSelectSchema(authenticatedUsers).shape.tag,
  locationEnvironmentId: createSelectSchema(environments).shape.id,
});

export class AuthenticatedUserDto extends createZodDto(
  AuthenticatedUserDtoSchema,
) {}

/**
 * Ai User
 */
export const AiUserDtoSchema = z.object({
  type: z.literal("AI"),
  id: createSelectSchema(users).shape.id,
  tag: createSelectSchema(aiUsers).shape.tag,
  code: createSelectSchema(aiUsers).shape.code,
});

export const CreateAiUserDtoSchema = z.object({
  type: z.literal("AI"),
  id: createInsertSchema(users).shape.id,
  tag: createInsertSchema(aiUsers).shape.tag,
  code: createInsertSchema(aiUsers).shape.code,
});

export class AiUserDto extends createZodDto(AiUserDtoSchema) {}

/**
 * Unions
 */

export const UserDtoSchema = z.discriminatedUnion("type", [
  AnonymousUserDtoSchema,
  AuthenticatedUserDtoSchema,
  AiUserDtoSchema,
]);

export const CreateUserDtoSchema = z.discriminatedUnion("type", [
  CreateAnonymousUserDtoSchema,
  CreateAuthenticatedUserDtoSchema,
  CreateAiUserDtoSchema,
]);

/**
 * Types
 */
export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
export type UserDto = z.infer<typeof UserDtoSchema>;

type UserDtoMap = {
  ANONYMOUS: AnonymousUserDto;
  AUTHENTICATED: AuthenticatedUserDto;
  AI: AiUserDto;
};

export type InferUserDto<T extends CreateUserDto> = T extends {
  type: keyof UserDtoMap;
}
  ? UserDtoMap[T["type"]]
  : never;
