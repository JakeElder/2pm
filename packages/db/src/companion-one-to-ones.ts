import {
  CompanionOneToOneDto,
  CreateCompanionOneToOneDto,
} from "@2pm/data/dtos";
import {
  companionOneToOnes,
  environmentCompanionOneToOnes,
  environments,
} from "@2pm/data/schema";
import { DbModule } from "./db-module";

export default class CompanionOneToOnes extends DbModule {
  public async insert({
    id,
  }: CreateCompanionOneToOneDto): Promise<CompanionOneToOneDto> {
    const { transaction } = this.drizzle;

    const { environment, companionOneToOne } = await transaction(async (tx) => {
      const [environment] = await tx
        .insert(environments)
        .values({ id, type: "COMPANION_ONE_TO_ONE" })
        .returning();

      const [companionOneToOne] = await tx
        .insert(companionOneToOnes)
        .values({})
        .returning();

      const [environmentCompanionOneToOne] = await tx
        .insert(environmentCompanionOneToOnes)
        .values({
          environmentId: environment.id,
          companionOneToOneId: companionOneToOne.id,
        })
        .returning();

      return {
        environment,
        companionOneToOne,
        environmentCompanionOneToOne,
      };
    });

    return {
      environment,
      companionOneToOne,
    };
  }
}
