import { Pool } from "pg";
import * as appSchema from "./app.schema";
import * as librarySchema from "./library.schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export type DBContext<T extends Record<string, unknown>> = {
  pool: Pool;
  drizzle: NodePgDatabase<T>;
};

export type AppDBContext = DBContext<typeof appSchema>;
export type LibraryDBContext = DBContext<typeof librarySchema>;

export type DBContexts = {
  app: AppDBContext;
  library: LibraryDBContext;
};
