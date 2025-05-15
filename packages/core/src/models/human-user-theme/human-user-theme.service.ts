import { eq } from "drizzle-orm";
import { humanUsers, humanUserThemes, themes } from "../../db/app.schema";
import { DBServiceModule } from "../../db/db-service-module";
import {
  HumanUserThemeDto,
  UpdateHumanUserThemeDto,
} from "./human-user-theme.dto";
import HumanUsers from "../human-user/human-user.service";
import { HumanUser } from "../human-user/human-user.types";
import { HumanUserTheme } from "./human-user-theme.types";

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
    ...rest
  }: UpdateHumanUserThemeDto): Promise<HumanUserThemeDto> {
    await this.app.drizzle
      .update(humanUserThemes)
      .set(rest)
      .where(eq(humanUserThemes.id, id))
      .returning();

    const res = await this.find(id);

    if (!res) {
      throw new Error();
    }

    return res;
  }

  prev(id: HumanUserTheme["id"]): Promise<HumanUserThemeDto> {
    return this.shift(id, "PREV");
  }

  next(id: HumanUserTheme["id"]): Promise<HumanUserThemeDto> {
    return this.shift(id, "NEXT");
  }

  async shift(
    id: HumanUserTheme["id"],
    direction: "PREV" | "NEXT" = "NEXT",
  ): Promise<HumanUserThemeDto> {
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
      themeId: nextThemeId,
    });

    return next;
  }
}
