import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { rooms, roomWorldRooms, worldRooms } from "../drizzle/schema";

export const InsertWorldRoomDtoSchema = z.object({
  room: createInsertSchema(rooms).pick({ id: true }).optional(),
  worldRoom: createInsertSchema(worldRooms),
});

export const InsertWorldRoomResponseDtoSchema = z.object({
  room: createSelectSchema(rooms),
  worldRoom: createSelectSchema(worldRooms),
  roomWorldRoom: createSelectSchema(roomWorldRooms),
});
