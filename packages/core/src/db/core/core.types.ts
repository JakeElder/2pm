import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./core.schema";

export type CoreDrizzle = PostgresJsDatabase<typeof schema>;
