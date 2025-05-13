import { eq } from "drizzle-orm";
import { AppDBServiceModule } from "../../db/app/app-db-service-module";
import { users, humanUsers } from "../../db/app/app.schema";
import { CreateHumanUserDto } from "./human-user.dto";
import { AnonymousUserDto, AuthenticatedUserDto } from "../user/user.dto";
import { shorten } from "../../utils";
import { HumanUser, HumanUserDto } from "./human-user.types";

export default class HumanUsers extends AppDBServiceModule {
  async create(
    dto: CreateHumanUserDto = {},
  ): Promise<AnonymousUserDto | AuthenticatedUserDto> {
    const [user] = await this.drizzle
      .insert(users)
      .values({ type: "HUMAN" })
      .returning();

    const [humanUser] = await this.drizzle
      .insert(humanUsers)
      .values({
        userId: user.id,
        ...dto,
      })
      .returning();

    return HumanUsers.discriminate(humanUser);
  }

  async find(
    id: HumanUser["id"],
  ): Promise<AnonymousUserDto | AuthenticatedUserDto | null> {
    const res = await this.drizzle
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
