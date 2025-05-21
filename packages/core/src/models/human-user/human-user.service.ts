import { eq } from "drizzle-orm";
import { DBServiceModule } from "../../db/db-service-module";
import {
  users,
  humanUsers,
  humanUserThemes,
  humanUserConfigs,
} from "../../db/app.schema";
import { CreateHumanUserDto } from "./human-user.dto";
import { AnonymousUserDto, AuthenticatedUserDto } from "../user/user.dto";
import { shorten } from "../../utils";
import { HumanUser, HumanUserDto } from "./human-user.types";
import { DEFAULT_THEME_ID } from "../theme/theme.constants";

export default class HumanUsers extends DBServiceModule {
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
