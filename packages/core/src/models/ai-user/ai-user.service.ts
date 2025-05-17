import { DBServiceModule } from "../../db/db-service-module";
import { users, aiUsers, userEnvironmentPresences } from "../../db/app.schema";
import {
  AiUserDto,
  CreateAiUserDto,
  FilterAiUsersDto,
  FilterAiUsersDtoSchema,
} from "./ai-user.dto";
import { and, eq, isNull, SQL } from "drizzle-orm";

export default class AiUsers extends DBServiceModule {
  async create(dto: CreateAiUserDto): Promise<AiUserDto> {
    const [user] = await this.app.drizzle
      .insert(users)
      .values({ type: "AI" })
      .returning();

    const [aiUser] = await this.app.drizzle
      .insert(aiUsers)
      .values({ userId: user.id, ...dto })
      .returning();

    return aiUser;
  }

  public async findAll(filter: FilterAiUsersDto = {}): Promise<AiUserDto[]> {
    const { environmentId } = FilterAiUsersDtoSchema.parse(filter);

    if (environmentId) {
      const res = await this.app.drizzle
        .select({ aiUser: aiUsers })
        .from(aiUsers)
        .innerJoin(users, eq(aiUsers.userId, users.id))
        .innerJoin(
          userEnvironmentPresences,
          and(
            eq(userEnvironmentPresences.userId, users.id),
            eq(userEnvironmentPresences.environmentId, environmentId),
            isNull(userEnvironmentPresences.expired),
          ),
        )
        .where(eq(users.type, "AI"));

      return res.map((r) => r.aiUser);
    }

    return this.app.drizzle.select().from(aiUsers);
  }
}
