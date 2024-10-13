import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import * as schema from "../schema";
import type { USER_TYPES } from "../constants";

/**
 * Human Message
 */
export const HumanMessageDtoSchema = z.object({
  type: z.literal("HUMAN"),
  plotPoint: createSelectSchema(schema.plotPoints),
  message: createSelectSchema(schema.messages),
  humanMessage: createSelectSchema(schema.humanMessages),
  environment: createSelectSchema(schema.environments),
  user: createSelectSchema(schema.users),
  humanUser: createSelectSchema(schema.humanUsers),
});

export const UpdateHumanMessageDtoSchema = z.object({
  type: z.literal("HUMAN"),
  id: createSelectSchema(schema.messages).shape.id,
  content: createInsertSchema(schema.humanMessages).shape.content,
});

/**
 * Ai Message
 */
export const AiMessageDtoSchema = z.object({
  type: z.literal("AI"),
  plotPoint: createSelectSchema(schema.plotPoints),
  message: createSelectSchema(schema.messages),
  aiMessage: createSelectSchema(schema.aiMessages),
  environment: createSelectSchema(schema.environments),
  user: createSelectSchema(schema.users),
  aiUser: createSelectSchema(schema.aiUsers),
});

export const UpdateAiMessageDtoSchema = z.object({
  type: z.literal("AI"),
  id: createSelectSchema(schema.messages).shape.id,
  content: createInsertSchema(schema.aiMessages).shape.content,
  state: createInsertSchema(schema.aiMessages).shape.state,
});

/**
 * Unions
 */
export const MessageDtoSchema = z.discriminatedUnion("type", [
  HumanMessageDtoSchema,
  AiMessageDtoSchema,
]);

export const UpdateMessageDtoSchema = z.discriminatedUnion("type", [
  UpdateHumanMessageDtoSchema,
  UpdateAiMessageDtoSchema,
]);

/**
 * Dtos
 */
export class HumanMessageDto extends createZodDto(HumanMessageDtoSchema) {}
export class AiMessageDto extends createZodDto(AiMessageDtoSchema) {}

export class UpdateHumanMessageDto extends createZodDto(
  UpdateHumanMessageDtoSchema,
) {}
export class UpdateAiMessageDto extends createZodDto(
  UpdateAiMessageDtoSchema,
) {}

/**
 * Types
 */
export type UpdateMessageDto = z.infer<typeof UpdateMessageDtoSchema>;
export type MessageDto = z.infer<typeof MessageDtoSchema>;

type MessageDtoMap = {
  HUMAN: HumanMessageDto;
  AI: AiMessageDto;
};

export type InferMessageDto<T extends { type: (typeof USER_TYPES)[number] }> =
  T extends {
    type: keyof MessageDtoMap;
  }
    ? MessageDtoMap[T["type"]]
    : never;

/**
 * Socket Events
 */
export const MessagesRoomJoinedEventSchema = z.object({
  messageId: createSelectSchema(schema.messages).shape.id,
});

export const MessagesRoomLeftEventSchema = z.object({
  messageId: createSelectSchema(schema.messages).shape.id,
});

export class MessagesRoomJoinedEventDto extends createZodDto(
  MessagesRoomJoinedEventSchema,
) {}

export class MessagesRoomLeftEventDto extends createZodDto(
  MessagesRoomLeftEventSchema,
) {}

interface MessagesClientToServerEvents {
  join: (body: MessagesRoomJoinedEventDto) => void;
  leave: (body: MessagesRoomLeftEventDto) => void;
}

interface MessagesServerToClientEvents {
  "messages.ai.updated": (body: AiMessageDto) => void;
}

export type MessagesClientSocket = ClientSocket<
  MessagesServerToClientEvents,
  MessagesClientToServerEvents
>;

export type MessagesServerSocket = Socket<
  MessagesClientToServerEvents,
  MessagesServerToClientEvents
>;

export type MessagesServer = Server<
  MessagesClientToServerEvents,
  MessagesServerToClientEvents
>;
