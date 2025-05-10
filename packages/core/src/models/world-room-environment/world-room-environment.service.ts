import { eq, asc, and, SQL, count, isNull, not } from "drizzle-orm";
import { CoreDBServiceModule } from "../../db/core/core-db-service-module";
import {
  environments,
  userEnvironmentPresences,
  worldRoomEnvironments,
} from "../../db/core/core.schema";
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

    return {
      ...worldRoomEnvironment,
      presentUsers: 0,
    };
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
      .select({
        worldRoomEnvironment: worldRoomEnvironments,
        presentUsers: count(userEnvironmentPresences.id),
      })
      .from(worldRoomEnvironments)
      .leftJoin(
        userEnvironmentPresences,
        and(
          eq(
            userEnvironmentPresences.environmentId,
            worldRoomEnvironments.environmentId,
          ),
          isNull(userEnvironmentPresences.expired),
        ),
      )
      .where(and(...filters))
      .groupBy(worldRoomEnvironments.id)
      .limit(limit ? limit : Number.MAX_SAFE_INTEGER)
      .orderBy(asc(worldRoomEnvironments.order));

    return res.map((r) => ({
      ...r.worldRoomEnvironment,
      presentUsers: r.presentUsers,
    }));
  }
}
