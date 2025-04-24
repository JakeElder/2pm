import { DBServiceModule } from "../../db/db-service-module";
import { plotPoints } from "../../db/schema";
import { CreatePlotPointDto, PlotPointDto } from "./plot-point.dto";

export default class PlotPoints extends DBServiceModule {
  async create(dto: CreatePlotPointDto): Promise<PlotPointDto> {
    const [plotPoint] = await this.drizzle
      .insert(plotPoints)
      .values(dto)
      .returning();

    return plotPoint;
  }
}
