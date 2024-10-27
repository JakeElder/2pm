import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { aiUsers, users, anonymousUsers } from "../schema";

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
});

export class AnonymousUserDto extends createZodDto(AnonymousUserDtoSchema) {}
export class CreateAnonymousUserDto extends createZodDto(
  CreateAnonymousUserDtoSchema,
) {}

/**
 * Ai User
 */
export const AiUserDtoSchema = z.object({
  type: z.literal("AI"),
  userId: createSelectSchema(users).shape.id,
  id: createSelectSchema(aiUsers).shape.id,
  tag: createSelectSchema(aiUsers).shape.tag,
  bio: createSelectSchema(aiUsers).shape.bio,
});

export const CreateAiUserDtoSchema = z.object({
  type: z.literal("AI"),
  id: createInsertSchema(aiUsers).shape.id,
  tag: createInsertSchema(aiUsers).shape.tag,
  bio: createInsertSchema(aiUsers).shape.bio,
});

export class AiUserDto extends createZodDto(AiUserDtoSchema) {}

/**
 * Unions
 */

export const UserDtoSchema = z.discriminatedUnion("type", [
  AnonymousUserDtoSchema,
  AiUserDtoSchema,
]);

export const CreateUserDtoSchema = z.discriminatedUnion("type", [
  CreateAnonymousUserDtoSchema,
  CreateAiUserDtoSchema,
]);

/**
 * Types
 */
export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
export type UserDto = z.infer<typeof UserDtoSchema>;

type UserDtoMap = {
  ANONYMOUS: AnonymousUserDto;
  AI: AiUserDto;
};

export type InferUserDto<T extends CreateUserDto> = T extends {
  type: keyof UserDtoMap;
}
  ? UserDtoMap[T["type"]]
  : never;
