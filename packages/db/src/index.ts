import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import { Drizzle } from "@2pm/data";
import Utils from "./utils";
import WorldRooms from "./world-rooms";
import CompanionOneToOnes from "./companion-one-to-ones";
import UserEnvironmentPresences from "./user-environment-presences";
import AiMessages from "./ai-messages";
import HumanMessages from "./human-messages";
import Users from "./users";

export default class DBService {
  private pg: Sql;

  public drizzle: Drizzle;
  public utils: Utils;
  public worldRooms: WorldRooms;
  public users: Users;
  public companionOneToOnes: CompanionOneToOnes;
  public userEnvironmentPresences: UserEnvironmentPresences;
  public aiMessages: AiMessages;
  public humanMessages: HumanMessages;

  constructor(dbUrl: string) {
    this.pg = postgres(dbUrl);
    this.drizzle = drizzle(this.pg);
    this.utils = new Utils(this.pg);
    this.worldRooms = new WorldRooms(this.pg);
    this.users = new Users(this.pg);
    this.companionOneToOnes = new CompanionOneToOnes(this.pg);
    this.userEnvironmentPresences = new UserEnvironmentPresences(this.pg);
    this.aiMessages = new AiMessages(this.pg);
    this.humanMessages = new HumanMessages(this.pg);
  }

  end() {
    return this.pg.end();
  }
}
