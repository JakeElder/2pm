import type { InferSelectModel } from "drizzle-orm";
import {
  ENVIRONMENT_TYPE_CODES,
  WORLD_ROOM_CODES,
} from "./environment.constants";
import { environments } from "../../db/schema";

export type Environment = InferSelectModel<typeof environments>;
export type EnvironmentTypeCode = (typeof ENVIRONMENT_TYPE_CODES)[number];
export type WorldRoomCode = (typeof WORLD_ROOM_CODES)[number];
