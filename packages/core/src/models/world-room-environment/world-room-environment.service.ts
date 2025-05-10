import { eq, asc, and, SQL } from "drizzle-orm";
import { CoreDBServiceModule } from "../../db/core/core-db-service-module";
import { environments, worldRoomEnvironments } from "../../db/core/core.schema";
import {
  CreateWorldRoomEnvironmentDto,
  FilterWorldRoomEnvironmentDto,
  FilterWorldRoomEnvironmentDtoSchema,
  WorldRoomEnvironmentDto,
} from "./world-room-environment.dto";

export default class WorldRoomEnvironments extends CoreDBServiceModule {
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
        ...dto,
      })
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

    const query = this.drizzle
      .select()
      .from(worldRoomEnvironments)
      .where(and(...filters))
      .orderBy(asc(worldRoomEnvironments.order));

    if (limit) {
      query.limit(limit);
    }

    const res = await query;

    return res;
  }
}
