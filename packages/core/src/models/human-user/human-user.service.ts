import { eq } from "drizzle-orm";
import { DBServiceModule } from "../../db/db-service-module";
import {
  users,
  humanUsers,
  humanUserThemes,
  humanUserConfigs,
  environments,
  plotPoints,
} from "../../db/app.schema";
import { CreateHumanUserDto, UpdateHumanUserTagDto } from "./human-user.dto";
import { AnonymousUserDto, AuthenticatedUserDto } from "../user/user.dto";
import { shorten } from "../../utils";
import { HumanUser, HumanUserDto } from "./human-user.types";
import { DEFAULT_THEME_ID } from "../theme/theme.constants";
import { HumanUserTagUpdatedPlotPointDto } from "../plot-point";

export default class HumanUsers extends DBServiceModule {
  async updateTag({
    humanUserId,
    environmentId,
    tag,
  }: UpdateHumanUserTagDto): Promise<HumanUserTagUpdatedPlotPointDto> {
    const r = await this.app.drizzle
      .select({ user: users, humanUser: humanUsers })
      .from(humanUsers)
      .innerJoin(users, eq(users.id, humanUsers.userId))
      .where(eq(humanUsers.id, humanUserId));

    const [{ user }] = r;

    const [newHumanUser] = await this.app.drizzle
      .update(humanUsers)
      .set({ tag })
      .where(eq(humanUsers.id, humanUserId))
      .returning();

    const [environment] = await this.app.drizzle
      .select()
      .from(environments)
      .where(eq(environments.id, environmentId));

    const [plotPoint] = await this.app.drizzle
      .insert(plotPoints)
      .values({
        type: "HUMAN_USER_TAG_UPDATED",
        environmentId: environment.id,
        userId: user.id,
      })
      .returning();

    return {
      type: "HUMAN_USER_TAG_UPDATED",
      data: {
        plotPoint,
        environment,
        humanUser: HumanUsers.discriminate(newHumanUser),
      },
    };
  }

  async create(
    dto: CreateHumanUserDto = {},
  ): Promise<AnonymousUserDto | AuthenticatedUserDto> {
    return this.app.drizzle.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({ type: "HUMAN" })
        .returning();

      const [humanUser] = await tx
        .insert(humanUsers)
        .values({ userId: user.id, ...dto })
        .returning();

      await tx
        .insert(humanUserThemes)
        .values({
          humanUserId: humanUser.id,
          themeId: DEFAULT_THEME_ID,
        })
        .returning();

      await tx
        .insert(humanUserConfigs)
        .values({ humanUserId: humanUser.id })
        .returning();

      return HumanUsers.discriminate(humanUser);
    });
  }

  async find(
    id: HumanUser["id"],
  ): Promise<AnonymousUserDto | AuthenticatedUserDto | null> {
    const res = await this.app.drizzle
      .select()
      .from(humanUsers)
      .where(eq(humanUsers.id, id))
      .limit(1);

    if (res.length === 0) {
      return null;
    }

    return HumanUsers.discriminate(res[0]);
  }

  static discriminate(user: HumanUser): HumanUserDto {
    const hash = shorten(user.id);
    return {
      type: user.tag ? "AUTHENTICATED" : "ANONYMOUS",
      data: { ...user, hash },
    };
  }
}
