import { z } from "zod";
import * as schema from "../schema";
import { createZodDto } from "@anatine/zod-nestjs";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { AiUserMessageDtoSchema, HumanUserMessageDtoSchema } from "./message";
import type { PLOT_POINT_TYPES } from "../constants";
import type { InferSelectModel } from "drizzle-orm";

/**
 * Human User Message
 */
export const HumanUserMessagePlotPointDtoSchema = z.object({
  type: z.literal("HUMAN_USER_MESSAGE"),
  data: HumanUserMessageDtoSchema,
});

export const HumanUserMessagePlotPointSummaryDtoSchema = z.object({
  type: z.literal("HUMAN_USER_MESSAGE"),
  data: z.object({
    user: createSelectSchema(schema.users).pick({ id: true }),
    humanUser: createSelectSchema(schema.humanUsers).pick({ id: true }),
    message: createSelectSchema(schema.messages).pick({ id: true }),
    humanUserMessage: createSelectSchema(schema.humanUserMessages).pick({
      content: true,
    }),
  }),
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

export class HumanUserMessagePlotPointSummaryDto extends createZodDto(
  HumanUserMessagePlotPointSummaryDtoSchema,
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

export const AiUserMessagePlotPointSummaryDtoSchema = z.object({
  type: z.literal("AI_USER_MESSAGE"),
  data: z.object({
    user: createSelectSchema(schema.users).pick({ id: true }),
    aiUser: createSelectSchema(schema.aiUsers).pick({
      id: true,
    }),
    message: createSelectSchema(schema.messages).pick({ id: true }),
    aiUserMessage: createSelectSchema(schema.aiUserMessages).pick({
      content: true,
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

export const EvaluationPlotPointSummaryDtoSchema = z.object({
  type: z.literal("EVALUATION"),
  data: z.object({
    user: createSelectSchema(schema.users).pick({ id: true }),
    aiUser: createSelectSchema(schema.aiUsers).pick({ id: true }),
    tool: createSelectSchema(schema.tools).pick({ id: true }),
    evaluation: createSelectSchema(schema.evaluations).pick({
      args: true,
    }),
  }),
});

export class EvaluationPlotPointDto extends createZodDto(
  EvaluationPlotPointDtoSchema,
) {}

export class CreateEvaluationPlotPointDto extends createZodDto(
  CreateEvaluationPlotPointDtoSchema,
) {}

export class EvaluationPlotPointSummaryDto extends createZodDto(
  EvaluationPlotPointSummaryDtoSchema,
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

export const AuthEmailSentPlotPointSummaryDtoSchema = z.object({
  type: z.literal("AUTH_EMAIL_SENT"),
  data: z.object({
    user: createSelectSchema(schema.users).pick({ id: true }),
    authEmail: createSelectSchema(schema.authEmails).pick({
      email: true,
    }),
    humanUser: createSelectSchema(schema.humanUsers).pick({
      id: true,
    }),
  }),
});

export class AuthEmailSentPlotPointDto extends createZodDto(
  AuthEmailSentPlotPointDtoSchema,
) {}

export class CreateAuthEmailSentPlotPointDto extends createZodDto(
  CreateAuthEmailSentPlotPointDtoSchema,
) {}

export class AuthEmailSentPlotPointSummaryDto extends createZodDto(
  AuthEmailSentPlotPointSummaryDtoSchema,
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

export const PlotPointSummaryDtoSchema = z.discriminatedUnion("type", [
  HumanUserMessagePlotPointSummaryDtoSchema,
  AiUserMessagePlotPointSummaryDtoSchema,
  EvaluationPlotPointSummaryDtoSchema,
  AuthEmailSentPlotPointSummaryDtoSchema,
]);

export const CreatePlotPointDtoSchema = z.discriminatedUnion("type", [
  CreateHumanUserMessagePlotPointDtoSchema,
  CreateAiUserMessagePlotPointDtoSchema,
  CreateEvaluationPlotPointDtoSchema,
  CreateAuthEmailSentPlotPointDtoSchema,
]);

/**
 * Types
 */
export type PlotPoint = InferSelectModel<typeof schema.plotPoints>;

export type CreatePlotPointDto = z.infer<typeof CreatePlotPointDtoSchema>;
export type PlotPointDto = z.infer<typeof PlotPointDtoSchema>;
export type PlotPointSummaryDto = z.infer<typeof PlotPointSummaryDtoSchema>;

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
