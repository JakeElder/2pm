import { eq, inArray } from "drizzle-orm";
import {
  environments,
  humanUsers,
  humanUserThemes,
  plotPoints,
  plotPointThemeSwitches,
  themes,
  users,
} from "../../db/app.schema";
import { DBServiceModule } from "../../db/db-service-module";
import {
  HumanUserThemeDto,
  ShiftDirectionHumanUserThemeDto,
  ShiftHumanUserThemeDto,
  UpdateHumanUserThemeDto,
} from "./human-user-theme.dto";
import HumanUsers from "../human-user/human-user.service";
import { HumanUser } from "../human-user/human-user.types";
import { HumanUserTheme } from "./human-user-theme.types";
import { UserThemeSwitchedPlotPointDto } from "../plot-point/plot-point.dto";

export default class HumanUserThemes extends DBServiceModule {
  async find(id: HumanUserTheme["id"]): Promise<HumanUserThemeDto | null> {
    const res = await this.app.drizzle
      .select({
        humanUserTheme: humanUserThemes,
        humanUser: humanUsers,
        theme: themes,
      })
      .from(humanUserThemes)
      .where(eq(humanUserThemes.id, id))
      .innerJoin(humanUsers, eq(humanUsers.id, humanUserThemes.humanUserId))
      .innerJoin(themes, eq(themes.id, humanUserThemes.themeId))
      .limit(1);

    if (res.length === 0) {
      return null;
    }

    const { theme, humanUser, humanUserTheme } = res[0];

    return {
      id: humanUserTheme.id,
      theme,
      humanUser: HumanUsers.discriminate(humanUser),
    };
  }

  async findByHumanUserId(
    humanUserId: HumanUser["id"],
  ): Promise<HumanUserThemeDto | null> {
    const res = await this.app.drizzle
      .select({
        humanUserTheme: humanUserThemes,
        humanUser: humanUsers,
        theme: themes,
      })
      .from(humanUserThemes)
      .where(eq(humanUserThemes.humanUserId, humanUserId))
      .innerJoin(humanUsers, eq(humanUsers.id, humanUserThemes.humanUserId))
      .innerJoin(themes, eq(themes.id, humanUserThemes.themeId))
      .limit(1);

    if (res.length === 0) {
      return null;
    }

    const { theme, humanUser, humanUserTheme } = res[0];

    return {
      id: humanUserTheme.id,
      theme,
      humanUser: HumanUsers.discriminate(humanUser),
    };
  }

  async findAll(): Promise<HumanUserThemeDto[]> {
    const res = await this.app.drizzle
      .select({
        humanUserTheme: humanUserThemes,
        humanUser: humanUsers,
        theme: themes,
      })
      .from(humanUserThemes)
      .innerJoin(humanUsers, eq(humanUsers.id, humanUserThemes.humanUserId))
      .innerJoin(themes, eq(themes.id, humanUserThemes.themeId));

    return res.map((row) => {
      const { theme, humanUser, humanUserTheme } = row;
      return {
        id: humanUserTheme.id,
        theme,
        humanUser: HumanUsers.discriminate(humanUser),
      };
    });
  }

  async update({
    id,
    environmentId,
    ...rest
  }: UpdateHumanUserThemeDto): Promise<UserThemeSwitchedPlotPointDto> {
    const { from, to, plotPoint } = await this.app.drizzle.transaction(
      async (tx) => {
        const current = await this.find(id);

        if (!current) {
          throw new Error();
        }

        const fromId = current.theme.id;
        const toId = rest.themeId;

        const themeRows = await tx
          .select()
          .from(themes)
          .where(inArray(themes.id, [fromId, toId]));

        const from = themeRows.find((t) => t.id === fromId);
        const to = themeRows.find((t) => t.id === toId);

        if (!from || !to) {
          throw new Error();
        }

        const [hut] = await tx
          .update(humanUserThemes)
          .set(rest)
          .where(eq(humanUserThemes.id, id))
          .returning();

        const [{ user }] = await tx
          .select({ user: users })
          .from(users)
          .innerJoin(humanUsers, eq(users.id, humanUsers.userId))
          .where(eq(humanUsers.id, hut.humanUserId));

        const [plotPoint] = await tx
          .insert(plotPoints)
          .values({
            type: "USER_THEME_SWITCHED",
            userId: user.id,
            environmentId,
          })
          .returning();

        await tx.insert(plotPointThemeSwitches).values({
          fromThemeId: from.id,
          toThemeId: to.id,
          plotPointId: plotPoint.id,
        });

        return { from, to, plotPoint };
      },
    );

    const res = await this.find(id);

    const [environment] = await this.app.drizzle
      .select()
      .from(environments)
      .where(eq(environments.id, environmentId));

    if (!res || !environment) {
      throw new Error();
    }

    return {
      type: "USER_THEME_SWITCHED",
      data: {
        environment,
        plotPoint,
        humanUserTheme: res,
        from,
        to,
      },
    };
  }

  prev({
    id,
    environmentId,
  }: ShiftDirectionHumanUserThemeDto): Promise<UserThemeSwitchedPlotPointDto> {
    return this.shift({ id, environmentId, direction: "PREV" });
  }

  next({
    id,
    environmentId,
  }: ShiftDirectionHumanUserThemeDto): Promise<UserThemeSwitchedPlotPointDto> {
    return this.shift({ id, environmentId, direction: "NEXT" });
  }

  async shift({
    id,
    environmentId,
    direction,
  }: ShiftHumanUserThemeDto): Promise<UserThemeSwitchedPlotPointDto> {
    const allThemes = await this.app.drizzle
      .select()
      .from(themes)
      .orderBy(themes.id);

    const current = await this.find(id);

    if (!current) {
      throw new Error();
    }

    const currentIndex = allThemes.findIndex(
      (theme) => theme.id === current.theme.id,
    );

    if (typeof currentIndex === "undefined") {
      throw new Error();
    }

    const offset = direction === "NEXT" ? 1 : -1;
    const adjustedIndex =
      (currentIndex + offset + allThemes.length) % allThemes.length;
    const nextThemeId = allThemes[adjustedIndex].id;

    const next = await this.update({
      id,
      environmentId,
      themeId: nextThemeId,
    });

    return next;
  }
}
