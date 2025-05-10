import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { PlotPointDto } from "../plot-point";
import { environments, humanUsers } from "../../db/core/core.schema";

/**
 * Room Presence
 */
export const EnvironmentsRoomJoinedEventSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
});

export const EnvironmentsRoomLeftEventSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
});

export class EnvironmentsRoomJoinedEventDto extends createZodDto(
  EnvironmentsRoomJoinedEventSchema,
) {}

export class EnvironmentsRoomLeftEventDto extends createZodDto(
  EnvironmentsRoomLeftEventSchema,
) {}

/**
 * Socket Interfaces
 */
interface EnvironmentsClientToServerEvents {
  join: (body: EnvironmentsRoomJoinedEventDto) => void;
  leave: (body: EnvironmentsRoomLeftEventDto) => void;
}

interface EnvironmentsServerToClientEvents {
  "plot-points.created": (body: PlotPointDto) => void;
}

export type EnvironmentsClientSocket = ClientSocket<
  EnvironmentsServerToClientEvents,
  EnvironmentsClientToServerEvents
>;

export type EnvironmentsServerSocket = Socket<
  EnvironmentsClientToServerEvents,
  EnvironmentsServerToClientEvents
>;

export type EnvironmentsServer = Server<
  EnvironmentsClientToServerEvents,
  EnvironmentsServerToClientEvents
>;
