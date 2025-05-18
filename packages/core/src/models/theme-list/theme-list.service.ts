import { DBServiceModule } from "../../db/db-service-module";
import {
  environments,
  humanUsers,
  plotPoints,
  plotPointThemeLists,
  themeLists,
  themeListThemes,
  themes,
} from "../../db/app.schema";
import { ThemesListedPlotPointDto } from "../plot-point";
import { CreateThemeListDto } from "./theme-list.dto";
import { inArray, eq, InferInsertModel } from "drizzle-orm";
import HumanUsers from "../human-user/human-user.service";

type ThemeListTheme = InferInsertModel<typeof themeListThemes>;

export default class ThemeLists extends DBServiceModule {
  public async create({
    themeIds,
    environmentId,
    userId,
  }: CreateThemeListDto): Promise<ThemesListedPlotPointDto["data"]> {
    const { plotPoint, listedThemes, humanUser, environment } =
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

        const [plotPoint] = await tx
          .insert(plotPoints)
          .values({ type: "THEMES_LISTED", environmentId, userId })
          .returning();

        const [themeList] = await tx
          .insert(themeLists)
          .values({ plotPointId: plotPoint.id })
          .returning();

        await tx.insert(plotPointThemeLists).values({
          plotPointId: plotPoint.id,
          themeListId: themeList.id,
        });

        await tx.insert(themeListThemes).values(
          themeIds.map<ThemeListTheme>((themeId) => {
            return {
              themeListId: themeList.id,
              themeId,
            };
          }),
        );

        const listedThemes = await tx
          .select()
          .from(themes)
          .where(inArray(themes.id, themeIds));

        return { plotPoint, listedThemes, humanUser, environment };
      });

    return {
      plotPoint,
      environment,
      themes: listedThemes,
      humanUser: HumanUsers.discriminate(humanUser),
    };
  }
}
