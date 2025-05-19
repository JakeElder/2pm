import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { humanUsers, humanUserThemes, themes } from "../../db/app.schema";
import { ThemeUpdatedPlotPointDtoSchema } from "../plot-point/plot-point.dto";

/**
 * Presence
 */
export const ThemesRoomJoinedEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
  themeId: createSelectSchema(themes).shape.id,
});

export const ThemesRoomLeftEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
  themeId: createSelectSchema(themes).shape.id,
});

export class ThemesRoomJoinedEventDto extends createZodDto(
  ThemesRoomJoinedEventDtoSchema,
) {}

export class ThemesRoomLeftEventDto extends createZodDto(
  ThemesRoomLeftEventDtoSchema,
) {}

/**
 * Updated
 */
export const ThemeUpdatedEventDtoSchema = ThemeUpdatedPlotPointDtoSchema;

export class ThemeUpdatedEventDto extends createZodDto(
  ThemeUpdatedEventDtoSchema,
) {}

/**
 * Socket Interfaces
 */
interface ThemesClientToServerEvents {
  join: (body: ThemesRoomJoinedEventDto) => void;
  leave: (body: ThemesRoomLeftEventDto) => void;
}

interface ThemesServerToClientEvents {
  updated: (body: ThemeUpdatedEventDto) => void;
}

export type ThemesClientSocket = ClientSocket<
  ThemesServerToClientEvents,
  ThemesClientToServerEvents
>;

export type ThemesServerSocket = Socket<
  ThemesClientToServerEvents,
  ThemesServerToClientEvents
>;

export type ThemesServer = Server<
  ThemesClientToServerEvents,
  ThemesServerToClientEvents
>;
