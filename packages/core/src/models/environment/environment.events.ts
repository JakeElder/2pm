import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import { createSelectSchema } from "drizzle-zod";
import { environments, users } from "../../db/core/core.schema";
import { EnvironmentDtoSchema } from "./environment.dto";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { PlotPointDto } from "../plot-point";

export const EnvironmentsRoomJoinedEventSchema = z.object({
  userId: createSelectSchema(users).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
});

export const EnvironmentsRoomLeftEventSchema = z.object({
  userId: createSelectSchema(users).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
});

export class EnvironmentsRoomJoinedEventDto extends createZodDto(
  EnvironmentsRoomJoinedEventSchema,
) {}

export class EnvironmentsRoomLeftEventDto extends createZodDto(
  EnvironmentsRoomLeftEventSchema,
) {}

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
