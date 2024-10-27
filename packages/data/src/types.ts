import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import {
  AI_USER_CODES,
  ENVIRONMENT_TYPE_CODES,
  EVALUATABLE_PLOT_POINT_TYPES,
  ICON_CODES,
  MESSAGE_TYPES,
  PLOT_POINT_TYPES,
  TOOL_CODES,
  USER_TYPES,
  WORLD_ROOM_CODES,
} from "./constants";

export type Drizzle = PostgresJsDatabase<typeof schema>;

export type UserType = (typeof USER_TYPES)[number];
export type AiUserCode = (typeof AI_USER_CODES)[number];
export type EnvironmentTypeCode = (typeof ENVIRONMENT_TYPE_CODES)[number];
export type PlotPointType = (typeof PLOT_POINT_TYPES)[number];
export type EvaluatablePlotPointType =
  (typeof EVALUATABLE_PLOT_POINT_TYPES)[number];
export type MessageType = (typeof MESSAGE_TYPES)[number];
export type WorldRoomCode = (typeof WORLD_ROOM_CODES)[number];
export type IconCode = (typeof ICON_CODES)[number];
export type ToolCode = (typeof TOOL_CODES)[number];

export type PlotPointPerspective = "FIRST_PERSON" | "THIRD_PERSON" | "NEUTRAL";
