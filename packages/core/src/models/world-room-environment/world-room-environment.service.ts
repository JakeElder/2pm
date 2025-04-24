import { DBServiceModule } from "../../db/db-service-module";
import { environments, worldRoomEnvironments } from "../../db/schema";
import {
  CreateWorldRoomEnvironmentDto,
  WorldRoomEnvironmentDto,
} from "./world-room-environment.dto";

export default class WorldRoomEnvironments extends DBServiceModule {
  async create(
    dto: CreateWorldRoomEnvironmentDto,
  ): Promise<WorldRoomEnvironmentDto> {
    const [environment] = await this.drizzle
      .insert(environments)
      .values({ type: "WORLD_ROOM" })
      .returning();

    const [worldRoomEnvironment] = await this.drizzle
      .insert(worldRoomEnvironments)
      .values({
        environmentId: environment.id,
        id: dto.id,
      })
      .returning();

    return worldRoomEnvironment;
  }
}
