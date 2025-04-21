import { evaluations } from "../../db/schema";
import { DBServiceModule } from "../../db/db-service-module";
import { CreateEvaluationDto, EvaluationDto } from ".";

export default class Evaluations extends DBServiceModule {
  public async insert(dto: CreateEvaluationDto): Promise<EvaluationDto> {
    const [evaluation] = await this.drizzle
      .insert(evaluations)
      .values(dto)
      .returning();
    return evaluation;
  }
}
