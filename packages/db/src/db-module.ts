import { Drizzle } from "@2pm/schemas";
import { drizzle } from "drizzle-orm/postgres-js";
import { Sql } from "postgres";

export class DbModule {
  protected drizzle: Drizzle;
  constructor(protected pg: Sql) {
    this.drizzle = drizzle(this.pg);
    this.drizzle.delete = this.drizzle.delete.bind(this.drizzle);
    this.drizzle.transaction = this.drizzle.transaction.bind(this.drizzle);
  }
}
