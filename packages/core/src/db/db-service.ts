import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import UserEnvironmentPresences from "../models/user-environment-presence/user-environment-presence.service";
import Sessions from "../models/session/session.service";
import AuthEmails from "../models/auth-email/auth-email.service";
import { Drizzle } from "./types";
import AiMessages from "../models/ai-message/ai-message.service";
import Environments from "../models/environment/environment.service";
import WorldRoomEnvironments from "../models/world-room-environment/world-room-environment.service";
import AiUsers from "../models/ai-user/ai-user.service";
// import Users from "../models/user/user.service";
// import PlotPoints from "../models/plot-point/plot-points.service";
// import Messages from "../models/message/message.service";
// import Environments from "../models/environment/environment.service";

export class DBService {
  public pg: Sql;

  // public users: Users;
  // public plotPoints: PlotPoints;
  // public messages: Messages;
  // public environments: Environments;
  public drizzle: Drizzle;
  public worldRoomEnvironments: WorldRoomEnvironments;
  public aiMessages: AiMessages;
  public aiUsers: AiUsers;
  public userEnvironmentPresences: UserEnvironmentPresences;
  public sessions: Sessions;
  public authEmails: AuthEmails;

  constructor(dbUrl: string) {
    this.pg = postgres(dbUrl);
    this.drizzle = drizzle(this.pg);
    // this.users = new Users(this.pg);
    // this.plotPoints = new PlotPoints(this.pg);
    // this.messages = new Messages(this.pg);
    // this.environments = new Environments(this.pg);
    this.worldRoomEnvironments = new WorldRoomEnvironments(this.pg);
    this.aiMessages = new AiMessages(this.pg);
    this.aiUsers = new AiUsers(this.pg);
    this.userEnvironmentPresences = new UserEnvironmentPresences(this.pg);
    this.sessions = new Sessions(this.pg);
    this.authEmails = new AuthEmails(this.pg);
  }

  end() {
    return this.pg.end();
  }
}
