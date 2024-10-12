import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import * as schema from "../schema";
import type { USER_TYPES } from "../constants";

export const CreateHumanMessageDtoSchema = z.object({
  type: z.literal("HUMAN"),
  userId: createSelectSchema(schema.users).shape.id,
  environmentId: createSelectSchema(schema.environments).shape.id,
  content: createInsertSchema(schema.humanMessages).shape.content,
});

export const CreateAiMessageDtoSchema = z.object({
  type: z.literal("AI"),
  userId: createSelectSchema(schema.users).shape.id,
  environmentId: createSelectSchema(schema.environments).shape.id,
  content: createInsertSchema(schema.aiMessages).shape.content,
  state: createInsertSchema(schema.aiMessages).shape.state,
});

export const CreateMessageDtoSchema = z.discriminatedUnion("type", [
  CreateHumanMessageDtoSchema,
  CreateAiMessageDtoSchema,
]);

export const HumanMessageDtoSchema = z.object({
  type: z.literal("HUMAN"),
  plotPoint: createSelectSchema(schema.plotPoints),
  message: createSelectSchema(schema.messages),
  humanMessage: createSelectSchema(schema.humanMessages),
  environment: createSelectSchema(schema.environments),
  user: createSelectSchema(schema.users),
  humanUser: createSelectSchema(schema.humanUsers),
});

export const AiMessageDtoSchema = z.object({
  type: z.literal("AI"),
  plotPoint: createSelectSchema(schema.plotPoints),
  message: createSelectSchema(schema.messages),
  aiMessage: createSelectSchema(schema.aiMessages),
  environment: createSelectSchema(schema.environments),
  user: createSelectSchema(schema.users),
  aiUser: createSelectSchema(schema.aiUsers),
});

export const MessageDtoSchema = z.discriminatedUnion("type", [
  HumanMessageDtoSchema,
  AiMessageDtoSchema,
]);

export const UpdateHumanMessageDtoSchema = z.object({
  type: z.literal("HUMAN"),
  id: createSelectSchema(schema.messages).shape.id,
  content: createInsertSchema(schema.humanMessages).shape.content,
});

export const UpdateAiMessageDtoSchema = z.object({
  type: z.literal("AI"),
  id: createSelectSchema(schema.messages).shape.id,
  content: createInsertSchema(schema.aiMessages).shape.content,
  state: createInsertSchema(schema.aiMessages).shape.state,
});

export const UpdateMessageDtoSchema = z.discriminatedUnion("type", [
  UpdateHumanMessageDtoSchema,
  UpdateAiMessageDtoSchema,
]);

export class HumanMessageDto extends createZodDto(HumanMessageDtoSchema) {}
export class AiMessageDto extends createZodDto(AiMessageDtoSchema) {}

export class CreateHumanMessageDto extends createZodDto(
  CreateHumanMessageDtoSchema,
) {}
export class CreateAiMessageDto extends createZodDto(
  CreateAiMessageDtoSchema,
) {}

export class UpdateHumanMessageDto extends createZodDto(
  UpdateHumanMessageDtoSchema,
) {}
export class UpdateAiMessageDto extends createZodDto(
  UpdateAiMessageDtoSchema,
) {}

/**
 * Types
 */
export type CreateMessageDto = z.infer<typeof CreateMessageDtoSchema>;
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

export class MessagesRoomJoinedEventDto extends createZodDto(
  MessagesRoomJoinedEventSchema,
) {}

interface MessagesClientToServerEvents {
  join: (body: MessagesRoomJoinedEventDto) => void;
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
