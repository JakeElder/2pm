import * as schema from "../schema";
import * as seed from "@2pm/core/seed";
import { reset } from "drizzle-seed";
import { DBService } from "./db-module";
import UserEnvironmentPresences from "./user-environment-presences";
import Users from "./users";
import Messages from "./messages";
import PlotPoints from "./plot-points";
import Environments from "./environments";
import Tools from "./tools";

export default class Utils extends DBService {
  public async clear() {
    await reset(this.drizzle, schema);
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

    const [niko] = await Promise.all([
      ...seed.AI_USERS.map((user) => db.users.insert({ type: "AI", ...user })),
    ]);

    await Promise.all([
      db.userEnvironmentPresences.insert({
        environmentId: universe.data.environment.id,
        userId: niko.userId,
      }),
    ]);

    await db.plotPoints.insert({
      type: "AI_USER_MESSAGE",
      userId: niko.userId,
      environmentId: universe.data.environment.id,
      content: "Welcome to 2PM",
      state: "COMPLETE",
    });

    await Promise.all(seed.TOOLS.map((tool) => db.tools.insert(tool)));
  }
}
