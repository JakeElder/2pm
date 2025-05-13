import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { authEmails } from "../../db/app/app.schema";

export const AuthEmailDtoSchema = createSelectSchema(authEmails);
export const CreateAuthEmailDtoSchema = createInsertSchema(authEmails);

export type AuthEmailDto = InferSelectModel<typeof authEmails>;
export type CreateAuthEmailDto = InferInsertModel<typeof authEmails>;
