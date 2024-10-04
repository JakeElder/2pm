import { WorldRoomDto, CreateWorldRoomDto } from "@2pm/schemas/dto";
import {
  worldRooms,
  environmentWorldRooms,
  environments,
} from "@2pm/schemas/drizzle";
import { DbModule } from "./db-module";

export default class WorldRooms extends DbModule {
  public async insert({ id, code }: CreateWorldRoomDto): Promise<WorldRoomDto> {
    const { transaction } = this.drizzle;

    const { environment, worldRoom } = await transaction(async (tx) => {
      const [environment] = await tx
        .insert(environments)
        .values({ id, type: "WORLD_ROOM" })
        .returning();

      const [worldRoom] = await tx
        .insert(worldRooms)
        .values({ code })
        .returning();

      const [environmentWorldRoom] = await tx
        .insert(environmentWorldRooms)
        .values({
          environmentId: environment.id,
          worldRoomId: worldRoom.id,
        })
        .returning();

      return {
        environment,
        worldRoom,
        environmentWorldRoom,
      };
    });

    return {
      environment,
      worldRoom,
    };
  }
}
