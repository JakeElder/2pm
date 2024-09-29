import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  environments,
  environmentWorldRooms,
  worldRooms,
} from "../drizzle/schema";
import type { Z } from "..";

const InsertWorldRoomDtoSchema = z.object({
  environment: createInsertSchema(environments).pick({ id: true }).optional(),
  worldRoom: createInsertSchema(worldRooms),
});

const InsertWorldRoomResponseDtoSchema = z.object({
  environment: createSelectSchema(environments),
  worldRoom: createSelectSchema(worldRooms),
  environmentWorldRoom: createSelectSchema(environmentWorldRooms),
});

type InsertWorldRoomDto = Z<typeof InsertWorldRoomDtoSchema>;
type InsertWorldRoomResponseDto = Z<typeof InsertWorldRoomResponseDtoSchema>;

export {
  InsertWorldRoomDtoSchema,
  InsertWorldRoomResponseDtoSchema,
  type InsertWorldRoomDto,
  type InsertWorldRoomResponseDto,
};
