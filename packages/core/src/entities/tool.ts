import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tools } from "../schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const ToolDtoSchema = createSelectSchema(tools);
export const CreateToolDtoSchema = createInsertSchema(tools);

export type ToolDto = InferSelectModel<typeof tools>;
export type CreateToolDto = InferInsertModel<typeof tools>;
