import { DBServiceModule } from "../../db/db-service-module";
import { environments } from "../../db/schema";
import { CreateEnvironmentDto, EnvironmentDto } from "./environment.dto";

export default class Environments extends DBServiceModule {
  async create(dto: CreateEnvironmentDto): Promise<EnvironmentDto> {
    const [environment] = await this.drizzle
      .insert(environments)
      .values(dto)
      .returning();

    return environment;
  }
}
