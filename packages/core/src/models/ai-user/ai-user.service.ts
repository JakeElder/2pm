import { CoreDBServiceModule } from "../../db/core/core-db-service-module";
import { users, aiUsers } from "../../db/core/core.schema";
import { AiUserDto } from "../user/user.dto";
import { CreateAiUserDto } from "./ai-user.dto";

export default class AiUsers extends CoreDBServiceModule {
  async create(dto: CreateAiUserDto): Promise<AiUserDto> {
    const [user] = await this.drizzle
      .insert(users)
      .values({ type: "AI" })
      .returning();

    const [aiUser] = await this.drizzle
      .insert(aiUsers)
      .values({ userId: user.id, ...dto })
      .returning();

    return { type: "AI", data: aiUser };
  }
}
