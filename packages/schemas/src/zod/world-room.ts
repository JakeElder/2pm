import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { rooms, roomWorldRooms, worldRooms } from "../drizzle/schema";
import type { Z } from "..";

const InsertWorldRoomDtoSchema = z.object({
  room: createInsertSchema(rooms).pick({ id: true }).optional(),
  worldRoom: createInsertSchema(worldRooms),
});

const InsertWorldRoomResponseDtoSchema = z.object({
  room: createSelectSchema(rooms),
  worldRoom: createSelectSchema(worldRooms),
  roomWorldRoom: createSelectSchema(roomWorldRooms),
});

type InsertWorldRoomDto = Z<typeof InsertWorldRoomDtoSchema>;
type InsertWorldRoomResponseDto = Z<typeof InsertWorldRoomResponseDtoSchema>;

export {
  InsertWorldRoomDtoSchema,
  InsertWorldRoomResponseDtoSchema,
  type InsertWorldRoomDto,
  type InsertWorldRoomResponseDto,
};
