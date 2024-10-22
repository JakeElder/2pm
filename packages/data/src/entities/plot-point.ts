import { z } from "zod";
import * as schema from "../schema";
import { createZodDto } from "@anatine/zod-nestjs";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  AiUserMessageDtoSchema,
  AnonymousUserMessageDtoSchema,
  AuthenticatedUserMessageDtoSchema,
} from "./message";
import type { PLOT_POINT_TYPES } from "../constants";

/**
 * Anonymous User Message
 */
export const AnonymousUserMessagePlotPointDtoSchema = z.object({
  type: z.literal("ANONYMOUS_USER_MESSAGE"),
  data: AnonymousUserMessageDtoSchema,
});

export const AnonymousUserMessagePlotPointSummaryDtoSchema = z.object({
  type: z.literal("ANONYMOUS_USER_MESSAGE"),
  data: z.object({
    user: z.object({
      type: z.literal("ANONYMOUS_USER"),
      id: createSelectSchema(schema.users).shape.id,
    }),
    anonymousUser: z.object({
      id: createSelectSchema(schema.anonymousUsers).shape.id,
    }),
    message: z.object({
      id: createSelectSchema(schema.messages).shape.id,
      content: createSelectSchema(schema.anonymousUserMessages).shape.content,
    }),
  }),
});

export const CreateAnonymousUserMessagePlotPointDtoSchema = z.object({
  type: z.literal("ANONYMOUS_USER_MESSAGE"),
  userId: createSelectSchema(schema.users).shape.id,
  environmentId: createSelectSchema(schema.environments).shape.id,
  content: createSelectSchema(schema.anonymousUserMessages).shape.content,
});

export class AnonymousUserMessagePlotPointDto extends createZodDto(
  AnonymousUserMessagePlotPointDtoSchema,
) {}

export class AnonymousUserMessagePlotPointSummaryDto extends createZodDto(
  AnonymousUserMessagePlotPointSummaryDtoSchema,
) {}

export class CreateAnonymousUserMessagePlotPointDto extends createZodDto(
  CreateAnonymousUserMessagePlotPointDtoSchema,
) {}

/**
 * Authenticated User Message
 */
export const AuthenticatedUserMessagePlotPointDtoSchema = z.object({
  type: z.literal("AUTHENTICATED_USER_MESSAGE"),
  data: AuthenticatedUserMessageDtoSchema,
});

export const AuthenticatedUserMessagePlotPointSummaryDtoSchema = z.object({
  type: z.literal("AUTHENTICATED_USER_MESSAGE"),
  data: z.object({
    user: z.object({
      type: z.literal("AUTHENTICATED_USER"),
      id: createSelectSchema(schema.users).shape.id,
      tag: createSelectSchema(schema.authenticatedUsers).shape.tag,
    }),
    message: z.object({
      id: createSelectSchema(schema.messages).shape.id,
      content: createSelectSchema(schema.authenticatedUserMessages).shape
        .content,
    }),
  }),
});

export const CreateAuthenticatedUserMessagePlotPointDtoSchema = z.object({
  type: z.literal("AUTHENTICATED_USER_MESSAGE"),
  userId: createSelectSchema(schema.users).shape.id,
  environmentId: createSelectSchema(schema.environments).shape.id,
  content: createSelectSchema(schema.authenticatedUserMessages).shape.content,
});

export class AuthenticatedUserMessagePlotPointDto extends createZodDto(
  AuthenticatedUserMessagePlotPointDtoSchema,
) {}

export class AuthenticatedUserMessagePlotPointSummaryDto extends createZodDto(
  AuthenticatedUserMessagePlotPointSummaryDtoSchema,
) {}

export class CreateAuthenticatedUserMessagePlotPointDto extends createZodDto(
  CreateAuthenticatedUserMessagePlotPointDtoSchema,
) {}

/**
 * Ai Message
 */
export const AiUserMessagePlotPointDtoSchema = z.object({
  type: z.literal("AI_USER_MESSAGE"),
  data: AiUserMessageDtoSchema,
});

export const AiUserMessagePlotPointSummaryDtoSchema = z.object({
  type: z.literal("AI_USER_MESSAGE"),
  data: z.object({
    user: z.object({
      type: z.literal("AI"),
      id: createSelectSchema(schema.users).shape.id,
      tag: createSelectSchema(schema.aiUsers).shape.tag,
    }),
    message: z.object({
      id: createSelectSchema(schema.messages).shape.id,
      state: createSelectSchema(schema.aiUserMessages).shape.state,
      content: createSelectSchema(schema.aiUserMessages).shape.content,
    }),
  }),
});

export const CreateAiUserMessagePlotPointDtoSchema = z.object({
  type: z.literal("AI_USER_MESSAGE"),
  userId: createSelectSchema(schema.users).shape.id,
  environmentId: createSelectSchema(schema.environments).shape.id,
  content: createInsertSchema(schema.aiUserMessages).shape.content,
  state: createInsertSchema(schema.aiUserMessages).shape.state,
});

export class AiUserMessagePlotPointDto extends createZodDto(
  AiUserMessagePlotPointDtoSchema,
) {}

export class AiUserMessagePlotPointSummaryDto extends createZodDto(
  AiUserMessagePlotPointSummaryDtoSchema,
) {}

export class CreateAiUserMessagePlotPointDto extends createZodDto(
  CreateAiUserMessagePlotPointDtoSchema,
) {}

/**
 * Unions
 */
export const PlotPointDtoSchema = z.discriminatedUnion("type", [
  AnonymousUserMessagePlotPointDtoSchema,
  AuthenticatedUserMessagePlotPointDtoSchema,
  AiUserMessagePlotPointDtoSchema,
]);

export const PlotPointSummaryDtoSchema = z.discriminatedUnion("type", [
  AnonymousUserMessagePlotPointSummaryDtoSchema,
  AuthenticatedUserMessagePlotPointSummaryDtoSchema,
  AiUserMessagePlotPointSummaryDtoSchema,
]);

export const CreatePlotPointDtoSchema = z.discriminatedUnion("type", [
  CreateAnonymousUserMessagePlotPointDtoSchema,
  CreateAuthenticatedUserMessagePlotPointDtoSchema,
  CreateAiUserMessagePlotPointDtoSchema,
]);

/**
 * Types
 */
export type CreatePlotPointDto = z.infer<typeof CreatePlotPointDtoSchema>;
export type PlotPointDto = z.infer<typeof PlotPointDtoSchema>;
export type PlotPointSummaryDto = z.infer<typeof PlotPointSummaryDtoSchema>;

type PlotPointDtoMap = {
  ANONYMOUS_USER_MESSAGE: AnonymousUserMessagePlotPointDto;
  AUTHENTICATED_USER_MESSAGE: AuthenticatedUserMessagePlotPointDto;
  AI_USER_MESSAGE: AiUserMessagePlotPointDto;
};

export type InferPlotPointDto<
  T extends { type: (typeof PLOT_POINT_TYPES)[number] },
> = T extends {
  type: keyof PlotPointDtoMap;
}
  ? PlotPointDtoMap[T["type"]]
  : never;
