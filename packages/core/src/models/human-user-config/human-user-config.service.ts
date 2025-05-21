import { eq } from "drizzle-orm";
import {
  environments,
  humanUsers,
  plotPoints,
  humanUserConfigs,
} from "../../db/app.schema";
import { DBServiceModule } from "../../db/db-service-module";
import {
  HumanUserConfigDto,
  UpdateHumanUserConfigDto,
} from "./human-user-config.dto";
import { HumanUserConfigUpdatedPlotPointDto } from "../plot-point";
import HumanUsers from "../human-user/human-user.service";
import { HumanUser } from "../human-user/human-user.types";

export default class HumanUserConfigs extends DBServiceModule {
  public async update({
    humanUserId,
    environmentId,
    userId,
    ...props
  }: UpdateHumanUserConfigDto): Promise<HumanUserConfigUpdatedPlotPointDto> {
    const { plotPoint, humanUserConfig, environment, humanUser } =
      await this.app.drizzle.transaction(async (tx) => {
        const [humanUser] = await tx
          .select()
          .from(humanUsers)
          .where(eq(humanUsers.userId, userId));

        const [environment] = await tx
          .select()
          .from(environments)
          .where(eq(environments.id, environmentId));

        if (!humanUser || !environment) {
          throw new Error();
        }

        console.dir(humanUserId, props);

        const [humanUserConfig] = await tx
          .update(humanUserConfigs)
          .set(props)
          .where(eq(humanUserConfigs.humanUserId, humanUserId))
          .returning();

        const [plotPoint] = await tx
          .insert(plotPoints)
          .values({
            type: "HUMAN_USER_CONFIG_UPDATED",
            environmentId,
            userId,
          })
          .returning();

        return {
          plotPoint,
          environment,
          humanUserConfig,
          humanUser,
        };
      });

    return {
      type: "HUMAN_USER_CONFIG_UPDATED",
      data: {
        plotPoint,
        humanUserConfig,
        environment,
        humanUser: HumanUsers.discriminate(humanUser),
      },
    };
  }

  async find(id: HumanUser["id"]): Promise<HumanUserConfigDto | null> {
    const [res] = await this.app.drizzle
      .select()
      .from(humanUserConfigs)
      .where(eq(humanUserConfigs.humanUserId, id))
      .limit(1);

    return res ? res : null;
  }
}
