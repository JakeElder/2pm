export type { ChannelCode } from "./constants";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./src/drizzle/schema";

export type DB = PostgresJsDatabase<typeof schema>;
