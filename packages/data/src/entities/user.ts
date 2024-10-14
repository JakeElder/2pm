import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { aiUsers, environments, authenticatedUsers, users } from "../schema";

export const CreateAnonymousUserDtoSchema = z.object({
  type: z.literal("ANONYMOUS"),
  id: createInsertSchema(users).shape.id,
  locationEnvironmentId: createSelectSchema(environments).shape.id,
});

export const CreateAuthenticatedUserDtoSchema = z.object({
  type: z.literal("AUTHENTICATED"),
  id: createInsertSchema(users).shape.id,
  tag: createInsertSchema(authenticatedUsers).shape.tag,
  locationEnvironmentId: createSelectSchema(environments).shape.id,
});

export const CreateAiUserDtoSchema = z.object({
  type: z.literal("AI"),
  id: createInsertSchema(users).shape.id,
  tag: createInsertSchema(aiUsers).shape.tag,
  code: createInsertSchema(aiUsers).shape.code,
});

export const CreateUserDtoSchema = z.discriminatedUnion("type", [
  CreateAnonymousUserDtoSchema,
  CreateAuthenticatedUserDtoSchema,
  CreateAiUserDtoSchema,
]);

export const AnonymousUserDtoSchema = z.object({
  type: z.literal("ANONYMOUS"),
  id: createSelectSchema(users).shape.id,
  locationEnvironmentId: createSelectSchema(environments).shape.id,
});

export const AuthenticatedUserDtoSchema = z.object({
  type: z.literal("AUTHENTICATED"),
  id: createSelectSchema(users).shape.id,
  tag: createSelectSchema(authenticatedUsers).shape.tag,
  locationEnvironmentId: createSelectSchema(environments).shape.id,
});

export const AiUserDtoSchema = z.object({
  type: z.literal("AI"),
  id: createSelectSchema(users).shape.id,
  tag: createSelectSchema(aiUsers).shape.tag,
  code: createSelectSchema(aiUsers).shape.code,
});

export const UserDtoSchema = z.discriminatedUnion("type", [
  AnonymousUserDtoSchema,
  AuthenticatedUserDtoSchema,
  AiUserDtoSchema,
]);

export class AnonymousUserDto extends createZodDto(AnonymousUserDtoSchema) {}
export class AuthenticatedUserDto extends createZodDto(
  AuthenticatedUserDtoSchema,
) {}
export class AiUserDto extends createZodDto(AiUserDtoSchema) {}

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
export type UserDto = z.infer<typeof UserDtoSchema>;

/**
 * Types
 */
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
