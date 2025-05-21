import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { humanUsers } from "../../db/app.schema";
import { HumanUserConfigUpdatedPlotPointDtoSchema } from "../plot-point/plot-point.dto";

/**
 * Presence
 */
export const HumanUserConfigsRoomJoinedEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
});

export const HumanUserConfigsRoomLeftEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
});

export class HumanUserConfigsRoomJoinedEventDto extends createZodDto(
  HumanUserConfigsRoomJoinedEventDtoSchema,
) {}

export class HumanUserConfigsRoomLeftEventDto extends createZodDto(
  HumanUserConfigsRoomLeftEventDtoSchema,
) {}

/**
 * Updated
 */
export const HumanUserConfigUpdatedEventDtoSchema =
  HumanUserConfigUpdatedPlotPointDtoSchema;

export class HumanUserConfigUpdatedEventDto extends createZodDto(
  HumanUserConfigUpdatedEventDtoSchema,
) {}

/**
 * Socket Interfaces
 */
interface HumanUserConfigsClientToServerEvents {
  join: (body: HumanUserConfigsRoomJoinedEventDto) => void;
  leave: (body: HumanUserConfigsRoomLeftEventDto) => void;
}

interface HumanUserConfigsServerToClientEvents {
  updated: (body: HumanUserConfigUpdatedEventDto) => void;
}

export type HumanUserConfigsClientSocket = ClientSocket<
  HumanUserConfigsServerToClientEvents,
  HumanUserConfigsClientToServerEvents
>;

export type HumanUserConfigsServerSocket = Socket<
  HumanUserConfigsClientToServerEvents,
  HumanUserConfigsServerToClientEvents
>;

export type HumanUserConfigsServer = Server<
  HumanUserConfigsClientToServerEvents,
  HumanUserConfigsServerToClientEvents
>;
