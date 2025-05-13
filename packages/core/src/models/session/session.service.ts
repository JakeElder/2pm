import { eq } from "drizzle-orm";
import { sessions, humanUsers } from "../../db/app/app.schema";
import { AppDBServiceModule } from "../../db/app/app-db-service-module";
import { CreateSessionDto, SessionDto } from "./session.dto";
import { Session } from "./session.types";
import HumanUsers from "../human-user/human-user.service";

export default class Sessions extends AppDBServiceModule {
  public async create<T extends CreateSessionDto>(dto: T): Promise<SessionDto> {
    const { humanUserId } = dto;

    const [humanUser] = await this.drizzle
      .select()
      .from(humanUsers)
      .where(eq(humanUsers.id, humanUserId))
      .limit(1);

    const [session] = await this.drizzle
      .insert(sessions)
      .values({ humanUserId: humanUser.id })
      .returning();

    return {
      ...session,
      user: HumanUsers.discriminate(humanUser),
    };
  }

  async find(id: Session["id"]): Promise<SessionDto | null> {
    const res = await this.drizzle
      .select({
        session: sessions,
        humanUser: humanUsers,
      })
      .from(sessions)
      .where(eq(sessions.id, id))
      .innerJoin(humanUsers, eq(humanUsers.id, sessions.humanUserId))
      .limit(1);

    if (res.length === 0) {
      return null;
    }

    const { session, humanUser } = res[0];

    return { ...session, user: HumanUsers.discriminate(humanUser) };
  }
}
