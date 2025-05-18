import { eq } from "drizzle-orm";
import {
  environments,
  humanUsers,
  plotPointCreatedThemes,
  plotPoints,
  themes,
} from "../../db/app.schema";
import { DBServiceModule } from "../../db/db-service-module";
import { CreateDefaultThemeDto, CreateThemeDto, ThemeDto } from "./theme.dto";
import { Theme } from "./theme.types";
import { ThemeCreatedPlotPointDto } from "../plot-point";
import HumanUsers from "../human-user/human-user.service";

export default class Themes extends DBServiceModule {
  public async createDefault(dto: CreateDefaultThemeDto): Promise<ThemeDto> {
    const [theme] = await this.app.drizzle
      .insert(themes)
      .values(dto)
      .returning();

    return theme;
  }

  public async create({
    environmentId,
    userId,
    ...rest
  }: CreateThemeDto): Promise<ThemeCreatedPlotPointDto["data"]> {
    const res = await this.app.drizzle.transaction(async (tx) => {
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
        .values({ type: "THEME_CREATED", environmentId, userId })
        .returning();

      console.log(rest);
      const [theme] = await this.app.drizzle
        .insert(themes)
        .values(rest)
        .returning();

      await tx
        .insert(plotPointCreatedThemes)
        .values({ plotPointId: plotPoint.id, themeId: theme.id })
        .returning();

      return {
        plotPoint,
        environment,
        theme,
        humanUser: HumanUsers.discriminate(humanUser),
      };
    });

    return res;
  }

  async findAll(): Promise<ThemeDto[]> {
    return this.app.drizzle.select().from(themes);
  }

  async find(id: Theme["id"]): Promise<ThemeDto | null> {
    const [res] = await this.app.drizzle
      .select()
      .from(themes)
      .where(eq(themes.id, id))
      .limit(1);

    return res ? res : null;
  }
}
