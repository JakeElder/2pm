import { createSelectSchema } from "drizzle-zod";
import { users } from "../drizzle.ts";

export const UserSchema = createSelectSchema(users);
