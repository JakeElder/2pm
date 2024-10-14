import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import { Drizzle } from "@2pm/data";
import Utils from "./utils";
import WorldRooms from "./world-rooms";
import CompanionOneToOnes from "./companion-one-to-ones";
import UserEnvironmentPresences from "./user-environment-presences";
import Users from "./users";
import Messages from "./messages";
import PlotPoints from "./plot-points";

export default class DBService {
  public pg: Sql;

  public drizzle: Drizzle;
  public utils: Utils;
  public worldRooms: WorldRooms;
  public users: Users;
  public companionOneToOnes: CompanionOneToOnes;
  public userEnvironmentPresences: UserEnvironmentPresences;
  public plotPoints: PlotPoints;
  public messages: Messages;

  constructor(dbUrl: string) {
    this.pg = postgres(dbUrl);
    this.drizzle = drizzle(this.pg);
    this.utils = new Utils(this.pg);
    this.worldRooms = new WorldRooms(this.pg);
    this.users = new Users(this.pg);
    this.companionOneToOnes = new CompanionOneToOnes(this.pg);
    this.userEnvironmentPresences = new UserEnvironmentPresences(this.pg);
    this.plotPoints = new PlotPoints(this.pg);
    this.messages = new Messages(this.pg);
  }

  end() {
    return this.pg.end();
  }
}
