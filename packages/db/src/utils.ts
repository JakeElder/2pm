import {
  users,
  plotPoints,
  environments,
  worldRoomEnvironments,
  plotPointMessages,
  messages,
  aiUsers,
  userEnvironmentPresences,
  companionOneToOneEnvironments,
  aiUserMessages,
  plotPointEnvironmentPresences,
  sessions,
  humanUsers,
  humanUserMessages,
  tools,
  plotPointEvaluations,
  evaluations,
  authEmails,
  plotPointAuthEmails,
} from "@2pm/data/schema";
import * as seed from "@2pm/data/seed";
import { DbModule } from "./db-module";
import UserEnvironmentPresences from "./user-environment-presences";
import Users from "./users";
import Messages from "./messages";
import PlotPoints from "./plot-points";
import Environments from "./environments";
import Tools from "./tools";

export default class Utils extends DbModule {
  public async clear() {
    const { delete: rm } = this.drizzle;

    // Truncate dependent tables first
    await rm(plotPointEnvironmentPresences);
    await rm(plotPointMessages);
    await rm(plotPointEvaluations);
    await rm(plotPointAuthEmails);
    await rm(userEnvironmentPresences);
    await rm(sessions);
    await rm(companionOneToOneEnvironments);
    await rm(tools);
    await rm(evaluations);
    await rm(authEmails);

    // Truncate tables that depend on users or messages
    await rm(humanUserMessages);
    await rm(humanUsers);
    await rm(aiUserMessages);
    await rm(aiUsers);

    // Truncate parent tables
    await rm(messages);
    await rm(plotPoints);
    await rm(users);

    // Truncate remaining independent tables
    await rm(worldRoomEnvironments);
    await rm(environments);
  }

  public async seed() {
    await this.clear();

    const db = {
      environments: new Environments(this.pg),
      users: new Users(this.pg),
      userEnvironmentPresences: new UserEnvironmentPresences(this.pg),
      plotPoints: new PlotPoints(this.pg),
      messages: new Messages(this.pg),
      tools: new Tools(this.pg),
    };

    const [universe] = await Promise.all([
      ...seed.WORLD_ROOM_ENVIRONMENTS.map((room) =>
        db.environments.insert({ type: "WORLD_ROOM", ...room }),
      ),
    ]);

    const [g] = await Promise.all([
      ...seed.AI_USERS.map((user) => db.users.insert({ type: "AI", ...user })),
    ]);

    await Promise.all([
      db.userEnvironmentPresences.insert({
        environmentId: universe.data.environment.id,
        userId: g.userId,
      }),
    ]);

    await db.plotPoints.insert({
      type: "AI_USER_MESSAGE",
      userId: g.userId,
      environmentId: universe.data.environment.id,
      content: "Standby for G stuff",
      state: "COMPLETE",
    });

    await Promise.all(seed.TOOLS.map((tool) => db.tools.insert(tool)));
  }
}
