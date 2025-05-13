import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import {
  aiMessages,
  environments,
  humanUsers,
} from "../../db/core/core.schema";
import { AiMessageDtoSchema } from "./ai-message.dto";

/**
 * Presence
 */
export const AiMessagesRoomJoinedEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
  aiMessageId: createSelectSchema(aiMessages).shape.id,
});

export const AiMessagesRoomLeftEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
  aiMessageId: createSelectSchema(aiMessages).shape.id,
});

export class AiMessagesRoomJoinedEventDto extends createZodDto(
  AiMessagesRoomJoinedEventDtoSchema,
) {}

export class AiMessagesRoomLeftEventDto extends createZodDto(
  AiMessagesRoomLeftEventDtoSchema,
) {}

/**
 * Ai Task Updated
 */
export const AiMessageUpdatedEventDtoSchema = AiMessageDtoSchema;

export class AiMessageUpdatedEventDto extends createZodDto(
  AiMessageUpdatedEventDtoSchema,
) {}

/**
 * Socket Interfaces
 */
interface AiMessagesClientToServerEvents {
  join: (body: AiMessagesRoomJoinedEventDto) => void;
  leave: (body: AiMessagesRoomLeftEventDto) => void;
}

interface AiMessagesServerToClientEvents {
  updated: (body: AiMessageUpdatedEventDto) => void;
}

export type AiMessagesClientSocket = ClientSocket<
  AiMessagesServerToClientEvents,
  AiMessagesClientToServerEvents
>;

export type AiMessagesServerSocket = Socket<
  AiMessagesClientToServerEvents,
  AiMessagesServerToClientEvents
>;

export type AiMessagesServer = Server<
  AiMessagesClientToServerEvents,
  AiMessagesServerToClientEvents
>;
