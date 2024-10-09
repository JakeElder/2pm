import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { z } from "zod";
import { HydratedPlotPointDtoSchema } from "./entities/hydrated-plot-point";
import { CreateUserDtoSchema } from "./entities/user";
import * as schema from "./schema";
import {
  AI_USER_CODES,
  ENVIRONMENT_TYPE_CODES,
  PLOT_POINT_TYPES,
  USER_TYPES,
} from "./constants";

export type Drizzle = PostgresJsDatabase<typeof schema>;

export type UserType = (typeof USER_TYPES)[number];
export type AiUserCode = (typeof AI_USER_CODES)[number];
export type EnvironmentTypeCode = (typeof ENVIRONMENT_TYPE_CODES)[number];
export type PlotPointType = (typeof PLOT_POINT_TYPES)[number];

export type PlotPointPerspective = "FIRST_PERSON" | "THIRD_PERSON" | "NEUTRAL";

export type HydratedPlotPoint = z.infer<typeof HydratedPlotPointDtoSchema>;
export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
export type UserDto = z.infer<typeof CreateUserDtoSchema>;
