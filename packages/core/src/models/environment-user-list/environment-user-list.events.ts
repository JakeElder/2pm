import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { environments, humanUsers } from "../../db/app.schema";
import { EnvironmentUserListDtoSchema } from "./environment-user-list.dto";

/**
 * Presence
 */
export const EnvironmentUserListsRoomJoinedEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
});

export const EnvironmentUserListsRoomLeftEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
});

export class EnvironmentUserListsRoomJoinedEventDto extends createZodDto(
  EnvironmentUserListsRoomJoinedEventDtoSchema,
) {}

export class EnvironmentUserListsRoomLeftEventDto extends createZodDto(
  EnvironmentUserListsRoomLeftEventDtoSchema,
) {}

/**
 * Updated
 */
export const EnvironmentUserListUpdatedEventDtoSchema =
  EnvironmentUserListDtoSchema;

export class EnvironmentUserListUpdatedEventDto extends createZodDto(
  EnvironmentUserListUpdatedEventDtoSchema,
) {}

/**
 * Socket Interfaces
 */
interface EnvironmentUserListsClientToServerEvents {
  join: (body: EnvironmentUserListsRoomJoinedEventDto) => void;
  leave: (body: EnvironmentUserListsRoomLeftEventDto) => void;
}

interface EnvironmentUserListsServerToClientEvents {
  updated: (body: EnvironmentUserListUpdatedEventDto) => void;
}

export type EnvironmentUserListsClientSocket = ClientSocket<
  EnvironmentUserListsServerToClientEvents,
  EnvironmentUserListsClientToServerEvents
>;

export type EnvironmentUserListsServerSocket = Socket<
  EnvironmentUserListsClientToServerEvents,
  EnvironmentUserListsServerToClientEvents
>;

export type EnvironmentUserListsServer = Server<
  EnvironmentUserListsClientToServerEvents,
  EnvironmentUserListsServerToClientEvents
>;
