import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { z } from "zod";
import { HydratedPlotPointDtoSchema } from "./entities/hydrated-plot-point";
import * as schema from "./schema";
import {
  AI_USER_CODES,
  ENVIRONMENT_TYPE_CODES,
  PLOT_POINT_TYPES,
} from "./constants";

export type Drizzle = PostgresJsDatabase<typeof schema>;

export type AiUserCode = (typeof AI_USER_CODES)[number];
export type EnvironmentTypeCode = (typeof ENVIRONMENT_TYPE_CODES)[number];
export type PlotPointType = (typeof PLOT_POINT_TYPES)[number];

export type PlotPointPerspective = "FIRST_PERSON" | "THIRD_PERSON" | "NEUTRAL";

export type HydratedPlotPoint = z.infer<typeof HydratedPlotPointDtoSchema>;
