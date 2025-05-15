import { eq } from "drizzle-orm";
import { humanUsers, humanUserThemes, themes } from "../../db/app.schema";
import { DBServiceModule } from "../../db/db-service-module";
import { HumanUserThemeDto } from "./human-user-theme.dto";
import HumanUsers from "../human-user/human-user.service";
import { HumanUser } from "../human-user/human-user.types";

export default class HumanUserThemes extends DBServiceModule {
  async find(humanUserId: HumanUser["id"]): Promise<HumanUserThemeDto | null> {
    const res = await this.app.drizzle
      .select({
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

    const { theme, humanUser } = res[0];

    return {
      theme,
      humanUser: HumanUsers.discriminate(humanUser),
    };
  }
}
