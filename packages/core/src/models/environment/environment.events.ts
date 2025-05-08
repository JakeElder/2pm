import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import { createSelectSchema } from "drizzle-zod";
import { environments, users } from "../../db/core/core.schema";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { PlotPointDto } from "../plot-point";
import { ActiveEnvironmentAiTaskDtoSchema } from "../environment-ai-task/environment-ai-task.dto";

/**
 * Room Presence
 */
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
interface EnvironmentsClientToServerEvents {
  join: (body: EnvironmentsRoomJoinedEventDto) => void;
  leave: (body: EnvironmentsRoomLeftEventDto) => void;
}

interface EnvironmentsServerToClientEvents {
  "plot-points.created": (body: PlotPointDto) => void;
  "ai-tasks.updated": (body: EnviromentAiTaskUpdatedEventDto) => void;
  "ai-tasks.completed": (body: EnviromentAiTaskCompletedEventDto) => void;
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
