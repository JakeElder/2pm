import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { humanUsers } from "../../db/app.schema";
import { UserSpaceListDtoSchema } from "./user-space-list.dto";

/**
 * Presence
 */
export const UserSpaceListsRoomJoinedEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
});

export const UserSpaceListsRoomLeftEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
});

export class UserSpaceListsRoomJoinedEventDto extends createZodDto(
  UserSpaceListsRoomJoinedEventDtoSchema,
) {}

export class UserSpaceListsRoomLeftEventDto extends createZodDto(
  UserSpaceListsRoomLeftEventDtoSchema,
) {}

/**
 * Updated
 */
export const UserSpaceListUpdatedEventDtoSchema = UserSpaceListDtoSchema;

export class UserSpaceListUpdatedEventDto extends createZodDto(
  UserSpaceListUpdatedEventDtoSchema,
) {}

/**
 * Socket Interfaces
 */
interface UserSpaceListsClientToServerEvents {
  join: (body: UserSpaceListsRoomJoinedEventDto) => void;
  leave: (body: UserSpaceListsRoomLeftEventDto) => void;
}

interface UserSpaceListsServerToClientEvents {
  updated: (body: UserSpaceListUpdatedEventDto) => void;
}

export type UserSpaceListsClientSocket = ClientSocket<
  UserSpaceListsServerToClientEvents,
  UserSpaceListsClientToServerEvents
>;

export type UserSpaceListsServerSocket = Socket<
  UserSpaceListsClientToServerEvents,
  UserSpaceListsServerToClientEvents
>;

export type UserSpaceListsServer = Server<
  UserSpaceListsClientToServerEvents,
  UserSpaceListsServerToClientEvents
>;
