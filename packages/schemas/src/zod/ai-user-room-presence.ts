import { createSelectSchema } from "drizzle-zod";
import { users, aiUserRoomPresences, rooms } from "../drizzle/schema";
import { z } from "zod";
import type { Z } from "..";

const InsertAiUserRoomPresenceDtoSchema = z.object({
  user: createSelectSchema(users).pick({ id: true }),
  room: createSelectSchema(rooms).pick({ id: true }),
});

const InsertAiUserRoomPresenceResponseDtoSchema = z.object({
  aiUserRoomPresence: createSelectSchema(aiUserRoomPresences),
});

type InsertAiUserRoomPresenceDto = Z<typeof InsertAiUserRoomPresenceDtoSchema>;
type InsertAiUserRoomPresenceResponseDto = Z<
  typeof InsertAiUserRoomPresenceResponseDtoSchema
>;

export {
  InsertAiUserRoomPresenceDtoSchema,
  InsertAiUserRoomPresenceResponseDtoSchema,
  type InsertAiUserRoomPresenceDto,
  type InsertAiUserRoomPresenceResponseDto,
};
