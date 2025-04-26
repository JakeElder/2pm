import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import { Drizzle } from "./library.types";

export class LibraryDBService {
  public pg: Sql;
  public drizzle: Drizzle;

  constructor(databaseUrl: string) {
    this.pg = postgres(databaseUrl);
    this.drizzle = drizzle(this.pg);
  }

  end() {
    return this.pg.end();
  }
}
