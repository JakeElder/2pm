import { createSelectSchema } from "drizzle-zod";
import { InferSelectModel } from "drizzle-orm";
import { authEmails } from "../../db/app.schema";

export const AuthEmailSchema = createSelectSchema(authEmails);
export type AuthEmail = InferSelectModel<typeof authEmails>;
