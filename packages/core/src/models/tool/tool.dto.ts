import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { tools } from "../../db/schema";

export const ToolDtoSchema = createSelectSchema(tools);
export const CreateToolDtoSchema = createInsertSchema(tools);

export type ToolDto = InferSelectModel<typeof tools>;
export type CreateToolDto = InferInsertModel<typeof tools>;
