import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  environments,
  environmentWorldRooms,
  worldRooms,
} from "../drizzle/schema";
import type { Z } from "..";

const InsertWorldRoomValuesSchema = z.object({
  environment: createInsertSchema(environments).pick({ id: true }).optional(),
  worldRoom: createInsertSchema(worldRooms).pick({ code: true }),
});

const InsertWorldRoomResponseSchema = z.object({
  environment: createSelectSchema(environments),
  worldRoom: createSelectSchema(worldRooms),
  environmentWorldRoom: createSelectSchema(environmentWorldRooms),
});

type InsertWorldRoomValues = Z<typeof InsertWorldRoomValuesSchema>;
type InsertWorldRoomResponse = Z<typeof InsertWorldRoomResponseSchema>;

export {
  InsertWorldRoomValuesSchema as InsertWorldRoomSchema,
  InsertWorldRoomResponseSchema,
  type InsertWorldRoomValues,
  type InsertWorldRoomResponse,
};
