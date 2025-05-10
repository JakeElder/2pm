import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import { reset } from "drizzle-seed";
import * as schema from "./core.schema";
import { CoreDrizzle } from "./core.types";
import { txt } from "../../utils";

import AiMessages from "../../models/ai-message/ai-message.service";
import AiUsers from "../../models/ai-user/ai-user.service";
import AuthEmails from "../../models/auth-email/auth-email.service";
import EnvironmentAiTasks from "../../models/environment-ai-task/environment-ai-task.service";
import HumanMessages from "../../models/human-message/human-message.service";
import HumanUsers from "../../models/human-user/human-user.service";
import PlotPoints from "../../models/plot-point/plot-point.service";
import Sessions from "../../models/session/session.service";
import UserEnvironmentPresences from "../../models/user-environment-presence/user-environment-presence.service";
import Users from "../../models/user/user.service";
import WorldRoomEnvironments from "../../models/world-room-environment/world-room-environment.service";
import SpaceLists from "../../models/space-list/space-list.service";

export class CoreDBService {
  public pg: Sql;
  public drizzle: CoreDrizzle;

  public aiMessages: AiMessages;
  public aiUsers: AiUsers;
  public authEmails: AuthEmails;
  public environmentAiTasks: EnvironmentAiTasks;
  public humanUsers: HumanUsers;
  public humanMessages: HumanMessages;
  public plotPoints: PlotPoints;
  public sessions: Sessions;
  public spaceLists: SpaceLists;
  public userEnvironmentPresences: UserEnvironmentPresences;
  public users: Users;
  public worldRoomEnvironments: WorldRoomEnvironments;

  constructor(databaseUrl: string) {
    this.pg = postgres(databaseUrl);
    this.drizzle = drizzle(this.pg);

    this.aiMessages = new AiMessages(this.pg);
    this.aiUsers = new AiUsers(this.pg);
    this.authEmails = new AuthEmails(this.pg);
    this.environmentAiTasks = new EnvironmentAiTasks(this.pg);
    this.humanMessages = new HumanMessages(this.pg);
    this.humanUsers = new HumanUsers(this.pg);
    this.plotPoints = new PlotPoints(this.pg);
    this.sessions = new Sessions(this.pg);
    this.spaceLists = new SpaceLists(this.pg);
    this.users = new Users(this.pg);
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
      this.worldRoomEnvironments.create({
        id: "UNIVERSE",
        slug: "universe",
        order: 1,
      }),
      this.worldRoomEnvironments.create({
        id: "CAMPFIRE",
        slug: "campfire",
        order: 2,
      }),
      this.worldRoomEnvironments.create({
        id: "ABOUT",
        slug: "about-2pm",
        order: 3,
      }),
    ]);

    // Ai Users
    const [niko, note, why] = await Promise.all([
      this.aiUsers.create({
        id: "NIKO",
        tag: "niko",
        bio: txt(<>Niko is our host.</>),
      }),
      this.aiUsers.create({
        id: "NOTE",
        tag: "note",
        bio: txt(<>Note is an expert on Buddhist teachings.</>),
      }),
      this.aiUsers.create({
        id: "WHY",
        tag: "why",
        bio: txt(<>Why is a general knowledge expert.</>),
      }),
    ]);

    // Human Users
    const [jake] = await Promise.all([
      this.humanUsers.create({
        tag: "jake",
      }),
    ]);

    // Environment Presences
    await Promise.all([
      this.userEnvironmentPresences.create({
        environmentId: universe.environmentId,
        userId: niko.data.userId,
      }),
      this.userEnvironmentPresences.create({
        environmentId: universe.environmentId,
        userId: note.data.userId,
      }),
      this.userEnvironmentPresences.create({
        environmentId: universe.environmentId,
        userId: why.data.userId,
      }),
      this.userEnvironmentPresences.create({
        environmentId: universe.environmentId,
        userId: jake.data.userId,
      }),
    ]);

    // Plot Points
    await this.aiMessages.create({
      userId: niko.data.userId,
      environmentId: universe.environmentId,
      content: "Welcome to the 2pm universe",
      state: "COMPLETE",
    });

    await this.humanMessages.create({
      userId: jake.data.userId,
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
