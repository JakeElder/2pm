import { eq, desc, and, SQL } from "drizzle-orm";
import { CoreDBServiceModule } from "../../db/core/core-db-service-module";
import { environments, worldRoomEnvironments } from "../../db/core/core.schema";
import {
  CreateWorldRoomEnvironmentDto,
  FilterWorldRoomEnvironmentDto,
  FilterWorldRoomEnvironmentDtoSchema,
  WorldRoomEnvironmentDto,
} from "./world-room-environment.dto";

export default class WorldRoomEnvironments extends CoreDBServiceModule {
  async create({
    id,
    slug,
  }: CreateWorldRoomEnvironmentDto): Promise<WorldRoomEnvironmentDto> {
    const [environment] = await this.drizzle
      .insert(environments)
      .values({ type: "WORLD_ROOM" })
      .returning();

    const [worldRoomEnvironment] = await this.drizzle
      .insert(worldRoomEnvironments)
      .values({ environmentId: environment.id, id, slug })
      .returning();

    return worldRoomEnvironment;
  }

  public async findAll(
    filter: FilterWorldRoomEnvironmentDto = {},
  ): Promise<WorldRoomEnvironmentDto[]> {
    const { id, slug, limit } =
      FilterWorldRoomEnvironmentDtoSchema.parse(filter);

    const filters: SQL[] = [];

    if (id) {
      filters.push(eq(worldRoomEnvironments.id, id));
    }

    if (slug) {
      filters.push(eq(worldRoomEnvironments.slug, slug));
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
