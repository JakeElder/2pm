import { asc, eq, and } from "drizzle-orm";
import { DBServiceModule } from "../../db/db-service-module";
import {
  environments,
  humanUserRoomEnvironments,
  humanUsers,
} from "../../db/app.schema";
import {
  CreateHumanUserRoomEnvironmentDto,
  FindUserRoomEnvironmentByPathDto,
  HumanUserRoomEnvironmentDto,
} from "./human-user-room-environment.dto";
import { Environment } from "../environment/environment.types";

export default class HumanUserRoomEnvironments extends DBServiceModule {
  async create(
    dto: CreateHumanUserRoomEnvironmentDto,
  ): Promise<HumanUserRoomEnvironmentDto> {
    const [environment] = await this.app.drizzle
      .insert(environments)
      .values({ type: "WORLD_ROOM" })
      .returning();

    const [humanUserRoomEnvironment] = await this.app.drizzle
      .insert(humanUserRoomEnvironments)
      .values({
        environmentId: environment.id,
        ...dto,
      })
      .returning();

    return humanUserRoomEnvironment;
  }

  async findAll(): Promise<HumanUserRoomEnvironmentDto[]> {
    const res = await this.app.drizzle
      .select()
      .from(humanUserRoomEnvironments)
      .orderBy(asc(humanUserRoomEnvironments.order));

    return res;
  }

  async findByPath({
    channel,
    tag,
  }: FindUserRoomEnvironmentByPathDto): Promise<Environment | null> {
    const [res] = await this.app.drizzle
      .select({ environment: environments })
      .from(humanUserRoomEnvironments)
      .innerJoin(
        environments,
        eq(environments.id, humanUserRoomEnvironments.environmentId),
      )
      .innerJoin(
        humanUsers,
        eq(humanUserRoomEnvironments.userId, humanUsers.userId),
      )
      .where(
        and(
          eq(humanUserRoomEnvironments.slug, channel),
          eq(humanUsers.tag, tag),
        ),
      )
      .limit(1);

    if (!res || !res.environment) {
      return null;
    }

    return res.environment;
  }
}
