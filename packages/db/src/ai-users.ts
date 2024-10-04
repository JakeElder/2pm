import { users, aiUsers } from "@2pm/schemas/drizzle";
import { DbModule } from "./db-module";
import { AiUserDto, CreateAiUserDto } from "@2pm/schemas/dto";

export default class AiUsers extends DbModule {
  public async insert({ id, tag, code }: CreateAiUserDto): Promise<AiUserDto> {
    const { transaction } = this.drizzle;

    return transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({ id, type: "AI", tag })
        .returning();

      const [aiUser] = await tx
        .insert(aiUsers)
        .values({ userId: user.id, code })
        .returning();

      return { user, aiUser };
    });
  }
}
