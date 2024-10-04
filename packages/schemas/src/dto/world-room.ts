import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { worldRooms, environments } from "../drizzle/schema";
import { createZodDto } from "@anatine/zod-nestjs";

const WorldRoomDtoSchema = z.object({
  environment: createSelectSchema(environments),
  worldRoom: createSelectSchema(worldRooms),
});

const CreateWorldRoomDtoSchema = z.object({
  id: createInsertSchema(worldRooms).shape.id,
  code: createInsertSchema(worldRooms).shape.code,
});

class WorldRoomDto extends createZodDto(WorldRoomDtoSchema) {}
class CreateWorldRoomDto extends createZodDto(CreateWorldRoomDtoSchema) {}

export {
  WorldRoomDtoSchema,
  WorldRoomDto,
  CreateWorldRoomDto,
  CreateWorldRoomDtoSchema,
};
