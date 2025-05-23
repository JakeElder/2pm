import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { humanUsers, themes } from "../../db/app.schema";
import { HumanUserTagUpdatedPlotPointDtoSchema } from "../plot-point/plot-point.dto";

/**
 * Presence
 */
export const HumanUsersRoomJoinedEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
});

export const HumanUsersRoomLeftEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
});

export class HumanUsersRoomJoinedEventDto extends createZodDto(
  HumanUsersRoomJoinedEventDtoSchema,
) {}

export class HumanUsersRoomLeftEventDto extends createZodDto(
  HumanUsersRoomLeftEventDtoSchema,
) {}

/**
 * Updated
 */
export const HumanUserTagUpdatedEventDtoSchema =
  HumanUserTagUpdatedPlotPointDtoSchema;

export class HumanUserTagUpdatedEventDto extends createZodDto(
  HumanUserTagUpdatedEventDtoSchema,
) {}

/**
 * Socket Interfaces
 */
interface HumanUsersClientToServerEvents {
  join: (body: HumanUsersRoomJoinedEventDto) => void;
  leave: (body: HumanUsersRoomLeftEventDto) => void;
}

interface HumanUsersServerToClientEvents {
  updated: (body: HumanUserTagUpdatedEventDto) => void;
}

export type HumanUsersClientSocket = ClientSocket<
  HumanUsersServerToClientEvents,
  HumanUsersClientToServerEvents
>;

export type HumanUsersServerSocket = Socket<
  HumanUsersClientToServerEvents,
  HumanUsersServerToClientEvents
>;

export type HumanUsersServer = Server<
  HumanUsersClientToServerEvents,
  HumanUsersServerToClientEvents
>;
