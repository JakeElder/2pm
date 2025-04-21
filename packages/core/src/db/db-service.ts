import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import Users from "../models/user/user.service";
import UserEnvironmentPresences from "../models/user-environment-presence/user-environment-presence.service";
import PlotPoints from "../models/plot-point/plot-points.service";
import Messages from "../models/message/message.service";
import Sessions from "../models/session/session.service";
import Environments from "../models/environment/environment.service";
import AuthEmails from "../models/auth-email/auth-email.service";
import { Drizzle } from "./types";

export class DBService {
  public pg: Sql;

  public drizzle: Drizzle;
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
