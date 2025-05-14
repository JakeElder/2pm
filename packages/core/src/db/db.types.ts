import * as appSchema from "./app.schema";
import * as librarySchema from "./library.schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Sql } from "postgres";

export type DBContext<T extends Record<string, unknown>> = {
  pg: Sql;
  drizzle: PostgresJsDatabase<T>;
};

export type AppDBContext = DBContext<typeof appSchema>;
export type LibraryDBContext = DBContext<typeof librarySchema>;

export type DBContexts = {
  app: AppDBContext;
  library: LibraryDBContext;
};
