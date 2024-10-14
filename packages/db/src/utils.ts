import {
  users,
  plotPoints,
  environments,
  worldRooms,
  environmentWorldRooms,
  plotPointMessages,
  messages,
  authenticatedUsers,
  aiUsers,
  userEnvironmentPresences,
  companionOneToOnes,
  environmentCompanionOneToOnes,
  aiUserMessages,
  authenticatedUserMessages,
  plotPointEnvironmentPresences,
  sessions,
} from "@2pm/data/schema";
import { DbModule } from "./db-module";
import WorldRooms from "./world-rooms";
import CompanionOneToOnes from "./companion-one-to-ones";
import UserEnvironmentPresences from "./user-environment-presences";
import Users from "./users";
import Messages from "./messages";
import PlotPoints from "./plot-points";

export default class Utils extends DbModule {
  public async clear() {
    const { delete: rm } = this.drizzle;

    // Truncate dependent tables first
    await rm(plotPointEnvironmentPresences);
    await rm(plotPointMessages);
    await rm(userEnvironmentPresences);
    await rm(environmentCompanionOneToOnes);
    await rm(environmentWorldRooms);
    await rm(sessions);

    // Truncate tables that depend on users or messages
    await rm(aiUserMessages);
    await rm(authenticatedUserMessages);
    await rm(aiUsers);
    await rm(authenticatedUsers);

    // Truncate parent tables
    await rm(messages);
    await rm(plotPoints);
    await rm(users);

    // Truncate remaining independent tables
    await rm(companionOneToOnes);
    await rm(worldRooms);
    await rm(environments);
  }

  public async seed() {
    await this.clear();

    const db = {
      worldRooms: new WorldRooms(this.pg),
      users: new Users(this.pg),
      companionOneToOnes: new CompanionOneToOnes(this.pg),
      userEnvironmentPresences: new UserEnvironmentPresences(this.pg),
      plotPoints: new PlotPoints(this.pg),
      messages: new Messages(this.pg),
    };

    const universe = await db.worldRooms.insert({
      id: 1,
      code: "UNIVERSE",
    });

    const [g] = await Promise.all([
      db.users.insert({ type: "AI", id: 1, tag: "g", code: "G" }),
      db.users.insert({ type: "AI", id: 2, tag: "ivan", code: "IVAN" }),
      db.users.insert({
        type: "AUTHENTICATED",
        id: 3,
        tag: "jake",
        locationEnvironmentId: universe.environment.id,
      }),
    ]);

    await Promise.all([
      db.userEnvironmentPresences.insert({
        environmentId: universe.environment.id,
        userId: g.id,
      }),
    ]);

    await db.plotPoints.insert({
      type: "AI_USER_MESSAGE",
      userId: g.id,
      environmentId: universe.environment.id,
      content: "Standby for G stuff",
      state: "COMPLETE",
    });
  }
}
