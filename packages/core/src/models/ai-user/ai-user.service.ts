import { DBServiceModule } from "../../db/db-service-module";
import { users, aiUsers } from "../../db/app.schema";
import { AiUserDto, CreateAiUserDto } from "./ai-user.dto";

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

  public async findAll(): Promise<AiUserDto[]> {
    const res = await this.app.drizzle.select().from(aiUsers);
    return res;
  }
}
