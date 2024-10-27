import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { aiUsers, users, humanUsers } from "../schema";

/**
 * Human User
 */

export const HumanUserDtoSchema = z.object({
  type: z.literal("HUMAN"),
  data: z.object({
    user: createSelectSchema(users),
    humanUser: createSelectSchema(humanUsers),
  }),
});

export const CreateHumanUserDtoSchema = z.object({
  type: z.literal("HUMAN"),
});

export class HumanUserDto extends createZodDto(HumanUserDtoSchema) {}
export class CreateHumanUserDto extends createZodDto(
  CreateHumanUserDtoSchema,
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
  HumanUserDtoSchema,
  AiUserDtoSchema,
]);

export const CreateUserDtoSchema = z.discriminatedUnion("type", [
  CreateHumanUserDtoSchema,
  CreateAiUserDtoSchema,
]);

/**
 * Types
 */
export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
export type UserDto = z.infer<typeof UserDtoSchema>;

type UserDtoMap = {
  HUMAN: HumanUserDto;
  AI: AiUserDto;
};

export type InferUserDto<T extends CreateUserDto> = T extends {
  type: keyof UserDtoMap;
}
  ? UserDtoMap[T["type"]]
  : never;
