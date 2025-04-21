import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

export type Drizzle = PostgresJsDatabase<typeof schema>;
