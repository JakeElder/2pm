import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { z, ZodType } from "zod";
import * as schema from "./drizzle/schema";
import type { AI_USER_CODES } from "./constants";

export * from "./zod";

export type Z<T extends ZodType> = z.infer<T>;
export type Drizzle = PostgresJsDatabase<typeof schema>;

export type AiUserCode = (typeof AI_USER_CODES)[number];
