import { createSelectSchema } from "drizzle-zod";
import { users } from "../drizzle/schema";
import type { Z } from "..";

const UserSchema = createSelectSchema(users);
type User = Z<typeof UserSchema>;

export { UserSchema, type User };
