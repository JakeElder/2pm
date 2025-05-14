import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { humanUsers } from "../../db/app.schema";
import { SpaceListDtoSchema } from "./space-list.dto";

/**
 * Presence
 */
export const SpaceListsRoomJoinedEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
});

export const SpaceListsRoomLeftEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
});

export class SpaceListsRoomJoinedEventDto extends createZodDto(
  SpaceListsRoomJoinedEventDtoSchema,
) {}

export class SpaceListsRoomLeftEventDto extends createZodDto(
  SpaceListsRoomLeftEventDtoSchema,
) {}

/**
 * Updated
 */
export const SpaceListUpdatedEventDtoSchema = SpaceListDtoSchema;

export class SpaceListUpdatedEventDto extends createZodDto(
  SpaceListUpdatedEventDtoSchema,
) {}

/**
 * Socket Interfaces
 */
interface SpaceListsClientToServerEvents {
  join: (body: SpaceListsRoomJoinedEventDto) => void;
  leave: (body: SpaceListsRoomLeftEventDto) => void;
}

interface SpaceListsServerToClientEvents {
  updated: (body: SpaceListUpdatedEventDto) => void;
}

export type SpaceListsClientSocket = ClientSocket<
  SpaceListsServerToClientEvents,
  SpaceListsClientToServerEvents
>;

export type SpaceListsServerSocket = Socket<
  SpaceListsClientToServerEvents,
  SpaceListsServerToClientEvents
>;

export type SpaceListsServer = Server<
  SpaceListsClientToServerEvents,
  SpaceListsServerToClientEvents
>;
