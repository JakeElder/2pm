import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import {
  AI_USER_CODES,
  ENVIRONMENT_TYPE_CODES,
  EVALUATABLE_PLOT_POINT_TYPES,
  MESSAGE_TYPES,
  PLOT_POINT_TYPES,
  THEMES,
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
export type ToolCode = (typeof TOOL_CODES)[number];

export type PlotPointPerspective = "FIRST_PERSON" | "THIRD_PERSON" | "NEUTRAL";

export type ChatStream = AsyncGenerator<string>;

type CoreColor =
  | "base"
  | "mantle"
  | "crust"
  | "text"
  | "subtext1"
  | "subtext0"
  | "overlay2"
  | "overlay1"
  | "overlay0"
  | "surface2"
  | "surface1"
  | "surface0";

type NamedColor =
  | "rosewater"
  | "flamingo"
  | "pink"
  | "mauve"
  | "red"
  | "maroon"
  | "peach"
  | "yellow"
  | "green"
  | "teal"
  | "sky"
  | "sapphire"
  | "blue"
  | "lavender";

export type ThemeId = (typeof THEMES)[number];
export type ThemeColor = CoreColor | NamedColor;
