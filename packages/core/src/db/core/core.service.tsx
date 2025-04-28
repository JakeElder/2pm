import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import { reset } from "drizzle-seed";
import AiMessages from "../../models/ai-message/ai-message.service";
import AiUsers from "../../models/ai-user/ai-user.service";
import AuthEmails from "../../models/auth-email/auth-email.service";
import HumanUsers from "../../models/human-user/human-user.service";
import Sessions from "../../models/session/session.service";
import UserEnvironmentPresences from "../../models/user-environment-presence/user-environment-presence.service";
import WorldRoomEnvironments from "../../models/world-room-environment/world-room-environment.service";
import HumanMessages from "../../models/human-message/human-message.service";
import PlotPoints from "../../models/plot-point/plot-point.service";
import * as schema from "./core.schema";
import { CoreDrizzle } from "./core.types";
import { txt } from "../../utils";

export class CoreDBService {
  public pg: Sql;
  public libraryPg: Sql;

  public drizzle: CoreDrizzle;
  public aiMessages: AiMessages;
  public aiUsers: AiUsers;
  public authEmails: AuthEmails;
  public humanUsers: HumanUsers;
  public humanMessages: HumanMessages;
  public plotPoints: PlotPoints;
  public sessions: Sessions;
  public userEnvironmentPresences: UserEnvironmentPresences;
  public worldRoomEnvironments: WorldRoomEnvironments;

  constructor(databaseUrl: string) {
    this.pg = postgres(databaseUrl);
    this.drizzle = drizzle(this.pg);

    this.aiMessages = new AiMessages(this.pg);
    this.aiUsers = new AiUsers(this.pg);
    this.authEmails = new AuthEmails(this.pg);
    this.humanMessages = new HumanMessages(this.pg);
    this.humanUsers = new HumanUsers(this.pg);
    this.plotPoints = new PlotPoints(this.pg);
    this.sessions = new Sessions(this.pg);
    this.userEnvironmentPresences = new UserEnvironmentPresences(this.pg);
    this.worldRoomEnvironments = new WorldRoomEnvironments(this.pg);
  }

  async clear() {
    await reset(this.drizzle, schema);
  }

  async seed() {
    await this.clear();

    // Environments
    const [universe] = await Promise.all([
      this.worldRoomEnvironments.create({ id: "UNIVERSE" }),
    ]);

    // Ai Users
    const [niko] = await Promise.all([
      this.aiUsers.create({
        id: "NIKO",
        tag: "niko",
        bio: txt(<>Niko is our host.</>),
      }),
    ]);

    // Human Users
    const [jake] = await Promise.all([
      this.humanUsers.create({
        tag: "jake",
        locationEnvironmentId: universe.environmentId,
      }),
    ]);

    // Environment Presences
    await Promise.all([
      this.userEnvironmentPresences.insert({
        environmentId: universe.environmentId,
        userId: niko.userId,
      }),
      this.userEnvironmentPresences.insert({
        environmentId: universe.environmentId,
        userId: jake.userId,
      }),
    ]);

    // Plot Points
    await this.aiMessages.create({
      userId: niko.userId,
      environmentId: universe.environmentId,
      content: "Welcome to the 2pm universe",
      state: "COMPLETE",
    });

    await this.humanMessages.create({
      userId: jake.userId,
      environmentId: universe.environmentId,
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "thank you ",
              },
              {
                type: "text",
                marks: [{ type: "bold" }],
                text: "sir",
              },
            ],
          },
        ],
      },
    });
  }

  end() {
    return this.pg.end();
  }
}
