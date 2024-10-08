import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { worldRooms, environments } from "../schema";
import { createZodDto } from "@anatine/zod-nestjs";

export const WorldRoomDtoSchema = z.object({
  environment: createSelectSchema(environments),
  worldRoom: createSelectSchema(worldRooms),
});

export const CreateWorldRoomDtoSchema = z.object({
  id: createInsertSchema(worldRooms).shape.id,
  code: createInsertSchema(worldRooms).shape.code,
});

export class WorldRoomDto extends createZodDto(WorldRoomDtoSchema) {}
export class CreateWorldRoomDto extends createZodDto(
  CreateWorldRoomDtoSchema,
) {}
