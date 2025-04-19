import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import { Drizzle } from "@2pm/core";
import Utils from "./utils";
import UserEnvironmentPresences from "./user-environment-presences";
import Users from "./users";
import Messages from "./messages";
import PlotPoints from "./plot-points";
import Sessions from "./sessions";
import Environments from "./environments";
import AuthEmails from "./auth-emails";

export class DBService {
  public pg: Sql;

  public drizzle: Drizzle;
  public utils: Utils;
  public users: Users;
  public userEnvironmentPresences: UserEnvironmentPresences;
  public plotPoints: PlotPoints;
  public messages: Messages;
  public sessions: Sessions;
  public environments: Environments;
  public authEmails: AuthEmails;

  constructor(dbUrl: string) {
    this.pg = postgres(dbUrl);
    this.drizzle = drizzle(this.pg);
    this.utils = new Utils(this.pg);
    this.users = new Users(this.pg);
    this.userEnvironmentPresences = new UserEnvironmentPresences(this.pg);
    this.plotPoints = new PlotPoints(this.pg);
    this.messages = new Messages(this.pg);
    this.sessions = new Sessions(this.pg);
    this.environments = new Environments(this.pg);
    this.authEmails = new AuthEmails(this.pg);
  }

  end() {
    return this.pg.end();
  }
}
