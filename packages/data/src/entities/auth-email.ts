import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { authEmails } from "../schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const AuthEmailDtoSchema = createSelectSchema(authEmails);
export const CreateAuthEmailDtoSchema = createInsertSchema(authEmails);

export type AuthEmailDto = InferSelectModel<typeof authEmails>;
export type CreateAuthEmailDto = InferInsertModel<typeof authEmails>;
