import { AppDBServiceModule } from "../../db/app/app-db-service-module";
import { users, aiUsers } from "../../db/app/app.schema";
import { AiUserDto, CreateAiUserDto } from "./ai-user.dto";

export default class AiUsers extends AppDBServiceModule {
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

  public async findAll(): Promise<AiUserDto[]> {
    const res = await this.drizzle.select().from(aiUsers);
    return res;
  }
}
