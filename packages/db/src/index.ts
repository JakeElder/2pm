import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import { Drizzle } from "@2pm/schemas";
import Utils from "./utils";

class DBService {
  public drizzle: Drizzle;
  public utils: Utils;
  private pg: Sql;

  constructor(dbUrl: string) {
    this.pg = postgres(dbUrl);
    this.drizzle = drizzle(this.pg);
    this.utils = new Utils(this.drizzle);
  }

  end() {
    return this.pg.end();
  }
}

export default DBService;
