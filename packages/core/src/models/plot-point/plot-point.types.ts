import { InferSelectModel } from "drizzle-orm";
import { environments, plotPoints } from "../../db/app.schema";
import { PLOT_POINT_TYPES } from "./plot-point.constants";

export type PlotPointType = (typeof PLOT_POINT_TYPES)[number];

export type PlotPointRow = {
  plotPoint: InferSelectModel<typeof plotPoints>;
  environment: InferSelectModel<typeof environments>;
};
