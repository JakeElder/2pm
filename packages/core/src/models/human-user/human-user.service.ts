import { eq } from "drizzle-orm";
import { CoreDBServiceModule } from "../../db/core/core-db-service-module";
import {
  users,
  humanUsers,
  environments,
  worldRoomEnvironments,
} from "../../db/core/core.schema";
import { CreateHumanUserDto } from "./human-user.dto";
import { AnonymousUserDto, AuthenticatedUserDto } from "../user/user.dto";
import { shorten } from "../../utils";
import { HumanUser, HumanUserDto } from "./human-user.types";

export default class HumanUsers extends CoreDBServiceModule {
  async create(
    dto: CreateHumanUserDto = {},
  ): Promise<AnonymousUserDto | AuthenticatedUserDto> {
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

    return HumanUsers.discriminate(humanUser);
  }

  async find(
    id: HumanUser["id"],
  ): Promise<AnonymousUserDto | AuthenticatedUserDto | null> {
    const res = await this.drizzle
      .select()
      .from(humanUsers)
      .where(eq(humanUsers.id, id))
      .limit(1);

    if (res.length === 0) {
      return null;
    }

    return HumanUsers.discriminate(res[0]);
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

  static discriminate(user: HumanUser): HumanUserDto {
    const hash = shorten(user.id);
    return {
      type: user.tag ? "AUTHENTICATED" : "ANONYMOUS",
      data: { ...user, hash },
    };
  }
}
