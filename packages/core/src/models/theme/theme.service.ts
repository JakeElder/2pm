import { eq } from "drizzle-orm";
import { themes } from "../../db/app.schema";
import { DBServiceModule } from "../../db/db-service-module";
import { CreateThemeDto, ThemeDto } from "./theme.dto";
import { Theme } from "./theme.types";

export default class Themes extends DBServiceModule {
  public async create<T extends CreateThemeDto>(dto: T): Promise<ThemeDto> {
    const [theme] = await this.app.drizzle
      .insert(themes)
      .values(dto)
      .returning();

    return theme;
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
