import { tools } from "@2pm/core/schema";
import { DBService } from "./db-module";
import { CreateToolDto, ToolDto } from "@2pm/core";

export default class Tools extends DBService {
  public async insert(dto: CreateToolDto): Promise<ToolDto> {
    const [tool] = await this.drizzle.insert(tools).values(dto).returning();
    return tool;
  }
}
