import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";
import { createZodDto } from "@anatine/zod-nestjs";
import { ApiProperty } from "@nestjs/swagger";
import type { JSONContent } from "@tiptap/core";
import {
  AiUserMessageDtoSchema,
  HumanUserMessageDtoSchema,
} from "../message/message.dto";
import * as schema from "../../db/schema";
import { PLOT_POINT_TYPES } from "./plot-point.constants";

/**
 * Human User Message
 */
export const HumanUserMessagePlotPointDtoSchema = z.object({
  type: z.literal("HUMAN_USER_MESSAGE"),
  data: HumanUserMessageDtoSchema,
});

export const CreateHumanUserMessagePlotPointDtoSchema = z.object({
  type: z.literal("HUMAN_USER_MESSAGE"),
  userId: createSelectSchema(schema.users).shape.id,
  environmentId: createSelectSchema(schema.environments).shape.id,
  content: createSelectSchema(schema.humanUserMessages).shape.content,
});

export class HumanUserMessagePlotPointDto extends createZodDto(
  HumanUserMessagePlotPointDtoSchema,
) {}

export class CreateHumanUserMessagePlotPointDto extends createZodDto(
  CreateHumanUserMessagePlotPointDtoSchema,
) {}

/**
 * Ai Message
 */
export const AiUserMessagePlotPointDtoSchema = z.object({
  type: z.literal("AI_USER_MESSAGE"),
  data: AiUserMessageDtoSchema,
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

export class CreateAiUserMessagePlotPointDto extends createZodDto(
  CreateAiUserMessagePlotPointDtoSchema,
) {}

/**
 * Evaluation
 */
export const EvaluationPlotPointDtoSchema = z.object({
  type: z.literal("EVALUATION"),
  data: z.object({
    plotPoint: createSelectSchema(schema.plotPoints),
    trigger: createSelectSchema(schema.plotPoints),
    user: createSelectSchema(schema.users),
    aiUser: createSelectSchema(schema.aiUsers),
    environment: createSelectSchema(schema.environments),
    evaluation: createSelectSchema(schema.evaluations),
    tool: createSelectSchema(schema.tools).extend({
      definition: z.any(),
    }),
  }),
});

export const CreateEvaluationPlotPointDtoSchema = z.object({
  type: z.literal("EVALUATION"),
  triggerId: createSelectSchema(schema.plotPoints).shape.id,
  userId: createSelectSchema(schema.users).shape.id,
  environmentId: createSelectSchema(schema.environments).shape.id,
  toolId: createSelectSchema(schema.tools).shape.id,
  args: createSelectSchema(schema.evaluations).shape.args,
});

export class EvaluationPlotPointDto extends createZodDto(
  EvaluationPlotPointDtoSchema,
) {}

export class CreateEvaluationPlotPointDto extends createZodDto(
  CreateEvaluationPlotPointDtoSchema,
) {}

/**
 * Auth Email Sent
 */
export const AuthEmailSentPlotPointDtoSchema = z.object({
  type: z.literal("AUTH_EMAIL_SENT"),
  data: z.object({
    plotPoint: createSelectSchema(schema.plotPoints),
    user: createSelectSchema(schema.users),
    environment: createSelectSchema(schema.environments),
    authEmail: createSelectSchema(schema.authEmails),
  }),
});

export const CreateAuthEmailSentPlotPointDtoSchema = z.object({
  type: z.literal("AUTH_EMAIL_SENT"),
  environmentId: createSelectSchema(schema.environments).shape.id,
  userId: createSelectSchema(schema.users).shape.id,
  email: createSelectSchema(schema.authEmails).shape.email,
  code: createSelectSchema(schema.authEmails).shape.code,
});

export class AuthEmailSentPlotPointDto extends createZodDto(
  AuthEmailSentPlotPointDtoSchema,
) {}

export class CreateAuthEmailSentPlotPointDto extends createZodDto(
  CreateAuthEmailSentPlotPointDtoSchema,
) {}

/**
 * Unions
 */
export const PlotPointDtoSchema = z.discriminatedUnion("type", [
  HumanUserMessagePlotPointDtoSchema,
  AiUserMessagePlotPointDtoSchema,
  EvaluationPlotPointDtoSchema,
  AuthEmailSentPlotPointDtoSchema,
]);

export const CreatePlotPointDtoSchema = z.discriminatedUnion("type", [
  CreateHumanUserMessagePlotPointDtoSchema,
  CreateAiUserMessagePlotPointDtoSchema,
  CreateEvaluationPlotPointDtoSchema,
  CreateAuthEmailSentPlotPointDtoSchema,
]);

/**
 * Filters
 */
export const FilterPlotPointsDtoSchema = z.object({
  types: z.preprocess(
    (val) => (val ? (Array.isArray(val) ? val : [val]) : undefined),
    z.array(z.enum(PLOT_POINT_TYPES)).optional(),
  ),
});

export class FilterPlotPointsDto extends createZodDto(
  FilterPlotPointsDtoSchema,
) {}

/**
 * Types
 */
export type PlotPoint = InferSelectModel<typeof schema.plotPoints>;

export type CreatePlotPointDto = z.infer<typeof CreatePlotPointDtoSchema>;
export type PlotPointDto = z.infer<typeof PlotPointDtoSchema>;

type PlotPointDtoMap = {
  HUMAN_USER_MESSAGE: HumanUserMessagePlotPointDto;
  AI_USER_MESSAGE: AiUserMessagePlotPointDto;
  EVALUATION: EvaluationPlotPointDto;
  AUTH_EMAIL_SENT: AuthEmailSentPlotPointDto;
};

export type InferPlotPointDto<
  T extends { type: (typeof PLOT_POINT_TYPES)[number] },
> = T extends {
  type: keyof PlotPointDtoMap;
}
  ? PlotPointDtoMap[T["type"]]
  : never;
