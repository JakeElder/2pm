import { eq, desc, and, SQL } from "drizzle-orm";
import { DBServiceModule } from "../../db/db-service-module";
import { environments, worldRoomEnvironments } from "../../db/schema";
import {
  CreateWorldRoomEnvironmentDto,
  FilterWorldRoomEnvironmentDto,
  FilterWorldRoomEnvironmentDtoSchema,
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

  public async findAll(
    filter: FilterWorldRoomEnvironmentDto = {},
  ): Promise<WorldRoomEnvironmentDto[]> {
    const { id, limit } = FilterWorldRoomEnvironmentDtoSchema.parse(filter);

    const filters: SQL[] = [];

    if (id) {
      filters.push(eq(worldRoomEnvironments.id, id));
    }

    const res = await this.drizzle
      .select()
      .from(worldRoomEnvironments)
      .where(and(...filters))
      .limit(limit ? limit : Number.MAX_SAFE_INTEGER)
      .orderBy(desc(worldRoomEnvironments.id));

    return res;
  }
}
