import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { humanUsers, humanUserThemes } from "../../db/app.schema";
import { UserThemeSwitchedPlotPointDtoSchema } from "../plot-point/plot-point.dto";

/**
 * Presence
 */
export const HumanUserThemesRoomJoinedEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
  humanUserThemeId: createSelectSchema(humanUserThemes).shape.id,
});

export const HumanUserThemesRoomLeftEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
  humanUserThemeId: createSelectSchema(humanUserThemes).shape.id,
});

export class HumanUserThemesRoomJoinedEventDto extends createZodDto(
  HumanUserThemesRoomJoinedEventDtoSchema,
) {}

export class HumanUserThemesRoomLeftEventDto extends createZodDto(
  HumanUserThemesRoomLeftEventDtoSchema,
) {}

/**
 * Updated
 */
export const HumanUserThemeUpdatedEventDtoSchema =
  UserThemeSwitchedPlotPointDtoSchema;

export class HumanUserThemeUpdatedEventDto extends createZodDto(
  HumanUserThemeUpdatedEventDtoSchema,
) {}

/**
 * Socket Interfaces
 */
interface HumanUserThemesClientToServerEvents {
  join: (body: HumanUserThemesRoomJoinedEventDto) => void;
  leave: (body: HumanUserThemesRoomLeftEventDto) => void;
}

interface HumanUserThemesServerToClientEvents {
  updated: (body: HumanUserThemeUpdatedEventDto) => void;
}

export type HumanUserThemesClientSocket = ClientSocket<
  HumanUserThemesServerToClientEvents,
  HumanUserThemesClientToServerEvents
>;

export type HumanUserThemesServerSocket = Socket<
  HumanUserThemesClientToServerEvents,
  HumanUserThemesServerToClientEvents
>;

export type HumanUserThemesServer = Server<
  HumanUserThemesClientToServerEvents,
  HumanUserThemesServerToClientEvents
>;
