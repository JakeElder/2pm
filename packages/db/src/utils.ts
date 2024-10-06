import {
  users,
  plotPoints,
  environments,
  worldRooms,
  environmentWorldRooms,
  plotPointMessages,
  messages,
  humanUsers,
  aiUsers,
  userEnvironmentPresences,
  companionOneToOnes,
  environmentCompanionOneToOnes,
  aiMessages,
  humanMessages,
  plotPointEnvironmentPresences,
} from "@2pm/data/schema";
import { DbModule } from "./db-module";
import WorldRooms from "./world-rooms";
import AiUsers from "./ai-users";
import HumanUsers from "./human-users";
import CompanionOneToOnes from "./companion-one-to-ones";
import UserEnvironmentPresences from "./user-environment-presences";
import AiMessages from "./ai-messages";
import HumanMessages from "./human-messages";

export default class Utils extends DbModule {
  public async clear() {
    const { delete: rm } = this.drizzle;

    // Truncate dependent tables first
    await rm(plotPointEnvironmentPresences);
    await rm(plotPointMessages);
    await rm(userEnvironmentPresences);
    await rm(environmentCompanionOneToOnes);
    await rm(environmentWorldRooms);

    // Truncate tables that depend on users or messages
    await rm(aiMessages);
    await rm(humanMessages);
    await rm(aiUsers);
    await rm(humanUsers);

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
      aiUsers: new AiUsers(this.pg),
      humanUsers: new HumanUsers(this.pg),
      companionOneToOnes: new CompanionOneToOnes(this.pg),
      userEnvironmentPresences: new UserEnvironmentPresences(this.pg),
      aiMessages: new AiMessages(this.pg),
      humanMessages: new HumanMessages(this.pg),
    };

    const universe = await db.worldRooms.insert({ id: 1, code: "UNIVERSE" });

    const [g, ivan, jake] = await Promise.all([
      db.aiUsers.insert({ id: 1, tag: "g", code: "G" }),
      db.aiUsers.insert({ id: 2, tag: "ivan", code: "IVAN" }),
      db.humanUsers.insert({
        id: 3,
        tag: "jake",
        locationEnvironmentId: universe.environment.id,
      }),
    ]);

    const o2o = await db.companionOneToOnes.insert({ id: 2 });

    await Promise.all([
      db.userEnvironmentPresences.insert({
        environmentId: universe.environment.id,
        userId: g.user.id,
      }),
      db.userEnvironmentPresences.insert({
        environmentId: o2o.environment.id,
        userId: ivan.user.id,
      }),
      db.userEnvironmentPresences.insert({
        userId: jake.user.id,
        environmentId: o2o.environment.id,
      }),
    ]);

    await db.aiMessages.insert({
      userId: g.user.id,
      environmentId: universe.environment.id,
      content: "Standby for G stuff",
    });

    await db.aiMessages.insert({
      userId: ivan.user.id,
      environmentId: o2o.environment.id,
      content: "Welcome back friend. Let's get you authenticated",
    });

    await db.humanMessages.insert({
      userId: jake.user.id,
      environmentId: o2o.environment.id,
      content: "Ok.",
    });
  }
}
