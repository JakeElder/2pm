import { evaluations } from "@2pm/data/schema";
import { DbModule } from "./db-module";
import { CreateEvaluationDto, EvaluationDto } from "@2pm/data";

export default class Evaluations extends DbModule {
  public async insert(dto: CreateEvaluationDto): Promise<EvaluationDto> {
    const [evaluation] = await this.drizzle
      .insert(evaluations)
      .values(dto)
      .returning();
    return evaluation;
  }
}
