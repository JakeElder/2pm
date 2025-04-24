import { DBServiceModule } from "../../db/db-service-module";
import { users, aiUsers } from "../../db/schema";
import { CreateAiUserDto, AiUserDto } from "./ai-user.dto";

export default class AiUsers extends DBServiceModule {
  async create(dto: CreateAiUserDto): Promise<AiUserDto> {
    const [user] = await this.drizzle
      .insert(users)
      .values({ type: "AI" })
      .returning();

    const [aiUser] = await this.drizzle
      .insert(aiUsers)
      .values({ userId: user.id, ...dto })
      .returning();

    return aiUser;
  }
}
