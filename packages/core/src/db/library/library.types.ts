import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./library.schema";

export type Drizzle = PostgresJsDatabase<typeof schema>;
