import { users, humanUsers } from "@2pm/schemas/drizzle";
import { HumanUserDto, CreateHumanUserDto } from "@2pm/schemas/dto";
import { DbModule } from "./db-module";

export default class HumanUsers extends DbModule {
  public async insert({
    id,
    tag,
    locationEnvironmentId,
  }: CreateHumanUserDto): Promise<HumanUserDto> {
    const { transaction } = this.drizzle;

    const { user, humanUser } = await transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({ id, type: "HUMAN", tag })
        .returning();

      const [humanUser] = await tx
        .insert(humanUsers)
        .values({ userId: user.id, locationEnvironmentId })
        .returning();

      return { user, humanUser };
    });

    return { user, humanUser };
  }
}
