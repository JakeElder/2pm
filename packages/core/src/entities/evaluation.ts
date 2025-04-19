import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { evaluations } from "../schema";

export const EvaluationDtoSchema = createSelectSchema(evaluations);
export const CreateEvaluationDtoSchema = createInsertSchema(evaluations);

export type EvaluationDto = InferSelectModel<typeof evaluations>;
export type CreateEvaluationDto = InferInsertModel<typeof evaluations>;
