export type { ChannelCode } from "../constants";

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./drizzle/schema";
import { z, ZodType } from "zod";
import {
  InsertHumanUserDtoSchema,
  InsertHumanUserResponseDtoSchema,
  InsertMessageDtoSchema,
  InsertMessageResponseDtoSchema,
  InsertWorldRoomDtoSchema,
  InsertWorldRoomResponseDtoSchema,
} from "./zod";

type Z<T extends ZodType> = z.infer<T>;

export type Drizzle = PostgresJsDatabase<typeof schema>;

export type InsertMessageDto = Z<typeof InsertMessageDtoSchema>;
export type InsertMessageResponseDto = Z<typeof InsertMessageResponseDtoSchema>;

export type InsertWorldRoomDto = Z<typeof InsertWorldRoomDtoSchema>;
export type InsertWorldRoomResponseDto = Z<
  typeof InsertWorldRoomResponseDtoSchema
>;

export type InsertHumanUserDto = Z<typeof InsertHumanUserDtoSchema>;
export type InsertHumanUserResponseDto = Z<
  typeof InsertHumanUserResponseDtoSchema
>;
