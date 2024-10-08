import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import * as schema from "../schema";

export const AiMessageDtoSchema = createSelectSchema(schema.aiMessages);

export const CreateAiMessageDtoSchema = z.object({
  userId: createSelectSchema(schema.users).shape.id,
  environmentId: createSelectSchema(schema.environments).shape.id,
  content: createInsertSchema(schema.aiMessages).shape.content,
});

export const UpdateAiMessageDtoSchema = z.object({
  aiMessageId: createSelectSchema(schema.aiMessages).shape.id,
  content: createInsertSchema(schema.aiMessages).shape.content,
});

export const AiMessageHydratedPlotPointDtoSchema = createSelectSchema(
  schema.plotPoints,
).extend({
  type: z.literal("AI_MESSAGE"),
  data: z.object({
    message: createSelectSchema(schema.messages),
    aiMessage: createSelectSchema(schema.aiMessages),
    user: createSelectSchema(schema.users),
    aiUser: createSelectSchema(schema.aiUsers),
    environment: createSelectSchema(schema.environments),
  }),
});

export class AiMessageDto extends createZodDto(AiMessageDtoSchema) {}

export class CreateAiMessageDto extends createZodDto(
  CreateAiMessageDtoSchema,
) {}

export class UpdateAiMessageDto extends createZodDto(
  UpdateAiMessageDtoSchema,
) {}

export class AiMessageHydratedPlotPointDto extends createZodDto(
  AiMessageHydratedPlotPointDtoSchema,
) {}

/**
 * Api Events
 */
export class AiMessageCreatedEventDto extends AiMessageHydratedPlotPointDto {}
export class AiMessageUpdatedEventDto extends AiMessageDto {}

/**
 * Socket Events
 */
export const AiMessagesRoomJoinedEventSchema = z.object({
  aiMessageId: createSelectSchema(schema.aiMessages).shape.id,
});

export class AiMessagesRoomJoinedEventDto extends createZodDto(
  AiMessagesRoomJoinedEventSchema,
) {}

interface AiMessagesClientToServerEvents {
  join: (body: AiMessagesRoomJoinedEventDto) => void;
}

interface AiMessagesServerToClientEvents {
  "ai-messages.updated": (body: AiMessageDto) => void;
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
