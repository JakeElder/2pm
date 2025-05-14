import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { environments, humanUsers } from "../../db/app.schema";
import { ActiveEnvironmentAiTaskDtoSchema } from "./environment-ai-task.dto";

/**
 * Presence
 */
export const EnvironmentAiTasksRoomJoinedEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
});

export const EnvironmentAiTasksRoomLeftEventDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
});

export class EnvironmentAiTasksRoomJoinedEventDto extends createZodDto(
  EnvironmentAiTasksRoomJoinedEventDtoSchema,
) {}

export class EnvironmentAiTasksRoomLeftEventDto extends createZodDto(
  EnvironmentAiTasksRoomLeftEventDtoSchema,
) {}

/**
 * Ai Task Updated
 */
export const EnvironmentAiTaskUpdatedEventDtoSchema =
  ActiveEnvironmentAiTaskDtoSchema;

export class EnviromentAiTaskUpdatedEventDto extends createZodDto(
  EnvironmentAiTaskUpdatedEventDtoSchema,
) {}

/**
 * Ai Task Completed
 */
export const EnvironmentAiTaskCompletedEventDtoSchema = z.object({
  environmentId: createSelectSchema(environments).shape.id,
});

export class EnviromentAiTaskCompletedEventDto extends createZodDto(
  EnvironmentAiTaskCompletedEventDtoSchema,
) {}

/**
 * Socket Interfaces
 */
interface EnvironmentAiTasksClientToServerEvents {
  join: (body: EnvironmentAiTasksRoomJoinedEventDto) => void;
  leave: (body: EnvironmentAiTasksRoomLeftEventDto) => void;
}

interface EnvironmentAiTasksServerToClientEvents {
  updated: (body: EnviromentAiTaskUpdatedEventDto) => void;
  completed: (body: EnviromentAiTaskCompletedEventDto) => void;
}

export type EnvironmentAiTasksClientSocket = ClientSocket<
  EnvironmentAiTasksServerToClientEvents,
  EnvironmentAiTasksClientToServerEvents
>;

export type EnvironmentAiTasksServerSocket = Socket<
  EnvironmentAiTasksClientToServerEvents,
  EnvironmentAiTasksServerToClientEvents
>;

export type EnvironmentAiTasksServer = Server<
  EnvironmentAiTasksClientToServerEvents,
  EnvironmentAiTasksServerToClientEvents
>;
