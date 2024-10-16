import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import * as schema from "../schema";
import type { MESSAGE_TYPES } from "../constants";
import { messages } from "../schema";

/**
 * Authenticated User Message
 */
export const AuthenticatedUserMessageDtoSchema = z.object({
  type: z.literal("AUTHENTICATED_USER"),
  plotPoint: createSelectSchema(schema.plotPoints),
  message: createSelectSchema(schema.messages),
  authenticatedUserMessage: createSelectSchema(
    schema.authenticatedUserMessages,
  ),
  environment: createSelectSchema(schema.environments),
  user: createSelectSchema(schema.users),
  authenticatedUser: createSelectSchema(schema.authenticatedUsers),
});

export const UpdateAuthenticatedUserMessageDtoSchema = z.object({
  type: z.literal("AUTHENTICATED_USER"),
  id: createSelectSchema(schema.messages).shape.id,
  content: createInsertSchema(schema.authenticatedUserMessages).shape.content,
});

/**
 * Ai User Message
 */
export const AiUserMessageDtoSchema = z.object({
  type: z.literal("AI_USER"),
  plotPoint: createSelectSchema(schema.plotPoints),
  message: createSelectSchema(schema.messages),
  aiUserMessage: createSelectSchema(schema.aiUserMessages),
  environment: createSelectSchema(schema.environments),
  user: createSelectSchema(schema.users),
  aiUser: createSelectSchema(schema.aiUsers),
});

export const UpdateAiUserMessageDtoSchema = z.object({
  type: z.literal("AI_USER"),
  id: createSelectSchema(schema.messages).shape.id,
  content: createInsertSchema(schema.aiUserMessages).shape.content,
  state: createInsertSchema(schema.aiUserMessages).shape.state,
});

/**
 * Queries
 */

export const FindMessagesQueryDtoSchema = z.object({
  type: createSelectSchema(messages).shape.type.optional(),
});

export class FindMessagesQueryDto extends createZodDto(
  FindMessagesQueryDtoSchema,
) {}

/**
 * Unions
 */
export const MessageDtoSchema = z.discriminatedUnion("type", [
  AuthenticatedUserMessageDtoSchema,
  AiUserMessageDtoSchema,
]);

export const UpdateMessageDtoSchema = z.discriminatedUnion("type", [
  UpdateAuthenticatedUserMessageDtoSchema,
  UpdateAiUserMessageDtoSchema,
]);

/**
 * Dtos
 */
export class AuthenticatedUserMessageDto extends createZodDto(
  AuthenticatedUserMessageDtoSchema,
) {}
export class AiUserMessageDto extends createZodDto(AiUserMessageDtoSchema) {}

export class UpdateAuthenticatedUserMessageDto extends createZodDto(
  UpdateAuthenticatedUserMessageDtoSchema,
) {}
export class UpdateAiUserMessageDto extends createZodDto(
  UpdateAiUserMessageDtoSchema,
) {}

/**
 * Types
 */
export type UpdateMessageDto = z.infer<typeof UpdateMessageDtoSchema>;
export type MessageDto = z.infer<typeof MessageDtoSchema>;

type MessageDtoMap = {
  AUTHENTICATED_USER: AuthenticatedUserMessageDto;
  AI_USER: AiUserMessageDto;
};

export type InferMessageDto<
  T extends { type: (typeof MESSAGE_TYPES)[number] },
> = T extends {
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
  "messages.ai.updated": (body: AiUserMessageDto) => void;
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
