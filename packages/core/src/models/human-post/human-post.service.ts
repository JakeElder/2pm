import { DBServiceModule } from "../../db/db-service-module";
import { plotPoints } from "../../db/app.schema";
import { CreateHumanPostDto } from "./human-post.dto";

export default class HumanMessages extends DBServiceModule {
  public async create({ userId, environmentId }: CreateHumanPostDto) {
    await this.app.drizzle
      .insert(plotPoints)
      .values({ type: "HUMAN_POST", environmentId, userId })
      .returning();
  }
}
