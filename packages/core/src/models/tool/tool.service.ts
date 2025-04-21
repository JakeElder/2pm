import { tools } from "../../db/schema";
import { DBServiceModule } from "../../db/db-service-module";
import { CreateToolDto, ToolDto } from ".";

export default class Tools extends DBServiceModule {
  public async insert(dto: CreateToolDto): Promise<ToolDto> {
    const [tool] = await this.drizzle.insert(tools).values(dto).returning();
    return tool;
  }
}
