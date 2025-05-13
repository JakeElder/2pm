import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./app.schema";

export type AppDrizzle = PostgresJsDatabase<typeof schema>;
