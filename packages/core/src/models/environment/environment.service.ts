import { CoreDBServiceModule } from "../../db/core/core-db-service-module";
import { environments } from "../../db/core/core.schema";
import { CreateEnvironmentDto, EnvironmentDto } from "./environment.dto";

export default class Environments extends CoreDBServiceModule {
  async create(dto: CreateEnvironmentDto): Promise<EnvironmentDto> {
    const [environment] = await this.drizzle
      .insert(environments)
      .values(dto)
      .returning();

    return environment;
  }
}
