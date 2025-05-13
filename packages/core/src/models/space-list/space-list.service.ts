import { eq, asc, and, count, isNull } from "drizzle-orm";
import { AppDBServiceModule } from "../../db/app/app-db-service-module";
import {
  userEnvironmentPresences,
  worldRoomEnvironments,
} from "../../db/app/app.schema";
import { SpaceListDto } from "./space-list.dto";

export default class SpaceLists extends AppDBServiceModule {
  public async find(): Promise<SpaceListDto> {
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
      .groupBy(worldRoomEnvironments.id)
      .orderBy(asc(worldRoomEnvironments.order));

    return {
      spaces: res.map((r) => {
        return {
          ...r.worldRoomEnvironment,
          userCount: r.presentUsers,
        };
      }),
    };
  }
}
