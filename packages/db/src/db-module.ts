import { Drizzle } from "@2pm/data";
import { drizzle } from "drizzle-orm/postgres-js";
import { Sql } from "postgres";

export class DBService {
  protected drizzle: Drizzle;
  constructor(protected pg: Sql) {
    this.drizzle = drizzle(this.pg);
    this.drizzle.delete = this.drizzle.delete.bind(this.drizzle);
    this.drizzle.transaction = this.drizzle.transaction.bind(this.drizzle);
  }
}
