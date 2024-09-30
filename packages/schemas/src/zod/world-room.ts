import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  environments,
  environmentWorldRooms,
  worldRooms,
} from "../drizzle/schema";
import type { Z } from "..";

const InsertWorldRoomSchema = z.object({
  environment: createInsertSchema(environments).pick({ id: true }).optional(),
  worldRoom: createInsertSchema(worldRooms),
});

const InsertWorldRoomResponseSchema = z.object({
  environment: createSelectSchema(environments),
  worldRoom: createSelectSchema(worldRooms),
  environmentWorldRoom: createSelectSchema(environmentWorldRooms),
});

type InsertWorldRoomValues = Z<typeof InsertWorldRoomSchema>;
type InsertWorldRoomResponse = Z<typeof InsertWorldRoomResponseSchema>;

export {
  InsertWorldRoomSchema,
  InsertWorldRoomResponseSchema,
  type InsertWorldRoomValues,
  type InsertWorldRoomResponse,
};
