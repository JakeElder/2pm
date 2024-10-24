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
  companionOneToOneEnvironments,
  aiUserMessages,
  authenticatedUserMessages,
  plotPointEnvironmentPresences,
  sessions,
  anonymousUsers,
  anonymousUserMessages,
} from "@2pm/data/schema";
import * as seed from "@2pm/data/seed";
import { DbModule } from "./db-module";
import WorldRooms from "./world-rooms";
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
    await rm(environmentWorldRooms);
    await rm(sessions);
    await rm(companionOneToOneEnvironments);

    // Truncate tables that depend on users or messages
    await rm(anonymousUserMessages);
    await rm(aiUserMessages);
    await rm(authenticatedUserMessages);
    await rm(aiUsers);
    await rm(authenticatedUsers);
    await rm(anonymousUsers);

    // Truncate parent tables
    await rm(messages);
    await rm(plotPoints);
    await rm(users);

    // Truncate remaining independent tables
    await rm(worldRooms);
    await rm(environments);
  }

  public async seed() {
    await this.clear();

    const db = {
      worldRooms: new WorldRooms(this.pg),
      users: new Users(this.pg),
      userEnvironmentPresences: new UserEnvironmentPresences(this.pg),
      plotPoints: new PlotPoints(this.pg),
      messages: new Messages(this.pg),
    };

    const [universe] = await Promise.all([
      ...seed.WORLD_ROOM_ENVIRONMENTS.map((room) =>
        db.worldRooms.insert({ ...room }),
      ),
    ]);

    const [g] = await Promise.all([
      ...seed.AI_USERS.map((user) => db.users.insert({ type: "AI", ...user })),
      ...seed.AUTHENTICATED_USERS.map((user) =>
        db.users.insert({ type: "AUTHENTICATED", ...user }),
      ),
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
