import { reset } from "drizzle-seed";
import * as schema from "./schema";
import * as seed from "./seed-data";
import UserEnvironmentPresences from "../models/user-environment-presence/user-environment-presence.service";
import Users from "../models/user/user.service";
import Messages from "../models/message/message.service";
import PlotPoints from "../models/plot-point/plot-points.service";
import Environments from "../models/environment/environment.service";
import Tools from "../models/tool/tool.service";
import { DBServiceModule } from "./db-service-module";

export default class Utils extends DBServiceModule {
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
