import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { aiUsers, environments, users } from "../schema";

export const CreateAnonymousUserDtoSchema = z.object({
  type: z.literal("ANONYMOUS"),
  id: createInsertSchema(users).shape.id,
  tag: createInsertSchema(users).shape.tag,
  locationEnvironmentId: createSelectSchema(environments).shape.id,
});

export const CreateHumanUserDtoSchema = z.object({
  type: z.literal("HUMAN"),
  id: createInsertSchema(users).shape.id,
  tag: createInsertSchema(users).shape.tag,
  locationEnvironmentId: createSelectSchema(environments).shape.id,
});

export const CreateAiUserDtoSchema = z.object({
  type: z.literal("AI"),
  id: createInsertSchema(users).shape.id,
  tag: createInsertSchema(users).shape.tag,
  code: createInsertSchema(aiUsers).shape.code,
});

export const AnonymousUserDtoSchema = z.object({
  type: z.literal("ANONYMOUS"),
  id: createSelectSchema(users).shape.id,
  tag: createSelectSchema(users).shape.tag,
  locationEnvironmentId: createSelectSchema(environments).shape.id,
});

export const HumanUserDtoSchema = z.object({
  type: z.literal("HUMAN"),
  id: createSelectSchema(users).shape.id,
  tag: createSelectSchema(users).shape.tag,
  locationEnvironmentId: createSelectSchema(environments).shape.id,
});

export const AiUserDtoSchema = z.object({
  type: z.literal("AI"),
  id: createSelectSchema(users).shape.id,
  tag: createSelectSchema(users).shape.tag,
  code: createSelectSchema(aiUsers).shape.code,
});

export const CreateUserDtoSchema = z.discriminatedUnion("type", [
  CreateAnonymousUserDtoSchema,
  CreateHumanUserDtoSchema,
  CreateAiUserDtoSchema,
]);

export const UserDtoSchema = z.discriminatedUnion("type", [
  AnonymousUserDtoSchema,
  HumanUserDtoSchema,
  AiUserDtoSchema,
]);

export class AnonymousUserDto extends createZodDto(AnonymousUserDtoSchema) {}
export class HumanUserDto extends createZodDto(HumanUserDtoSchema) {}
export class AiUserDto extends createZodDto(AiUserDtoSchema) {}
