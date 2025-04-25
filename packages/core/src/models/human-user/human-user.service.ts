import { eq } from "drizzle-orm";
import { DBServiceModule } from "../../db/db-service-module";
import {
  users,
  humanUsers,
  environments,
  worldRoomEnvironments,
} from "../../db/schema";
import { CreateHumanUserDto, HumanUserDto } from "./human-user.dto";
import { HumanUser } from "./human-user.types";

export default class HumanUsers extends DBServiceModule {
  async create(dto: CreateHumanUserDto = {}): Promise<HumanUserDto> {
    const locationEnvironmentId =
      dto.locationEnvironmentId ||
      (await this.getDefaultLocationEnvironmentId());

    const [user] = await this.drizzle
      .insert(users)
      .values({ type: "HUMAN" })
      .returning();

    const [humanUser] = await this.drizzle
      .insert(humanUsers)
      .values({
        userId: user.id,
        ...dto,
        locationEnvironmentId,
      })
      .returning();

    return humanUser;
  }

  async find(id: HumanUser["id"]): Promise<HumanUserDto | null> {
    const res = await this.drizzle
      .select()
      .from(humanUsers)
      .where(eq(humanUsers.id, id))
      .limit(1);

    if (res.length === 0) {
      return null;
    }

    return res[0];
  }

  private async getDefaultLocationEnvironmentId() {
    const [{ id }] = await this.drizzle
      .select({ id: environments.id })
      .from(worldRoomEnvironments)
      .innerJoin(
        environments,
        eq(environments.id, worldRoomEnvironments.environmentId),
      )
      .where(eq(worldRoomEnvironments.id, "UNIVERSE"));

    return id;
  }
}
