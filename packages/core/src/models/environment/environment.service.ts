import { AppDBServiceModule } from "../../db/app/app-db-service-module";
import { environments } from "../../db/app/app.schema";
import { CreateEnvironmentDto, EnvironmentDto } from "./environment.dto";

export default class Environments extends AppDBServiceModule {
  async create(dto: CreateEnvironmentDto): Promise<EnvironmentDto> {
    const [environment] = await this.drizzle
      .insert(environments)
      .values(dto)
      .returning();

    return environment;
  }
}
