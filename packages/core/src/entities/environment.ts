import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import type { PlotPointDto } from "./plot-point";
import {
  aiUsers,
  companionOneToOneEnvironments,
  environments,
  users,
  worldRoomEnvironments,
} from "../schema";

/**
 * Companion One To One Environment
 */
export const CompanionOneToOneEnvironmentDtoSchema = z.object({
  type: z.literal("COMPANION_ONE_TO_ONE"),
  data: z.object({
    environment: createSelectSchema(environments),
    companionOneToOneEnvironment: createSelectSchema(
      companionOneToOneEnvironments,
    ),
    user: createSelectSchema(users),
    companionUser: createSelectSchema(users),
    companionAiUser: createSelectSchema(aiUsers),
  }),
});

export const CreateCompanionOneToOneEnvironmentDtoSchema = z.object({
  type: z.literal("COMPANION_ONE_TO_ONE"),
  id: createInsertSchema(environments).shape.id,
  userId: createSelectSchema(users).shape.id,
  companionUserId: createSelectSchema(users).shape.id.optional(),
});

export class CompanionOneToOneEnvironmentDto extends createZodDto(
  CompanionOneToOneEnvironmentDtoSchema,
) {}
export class CreateCompanionOneToOneEnvironmentDto extends createZodDto(
  CreateCompanionOneToOneEnvironmentDtoSchema,
) {}

/**
 * World Room Environments
 */
export const WorldRoomEnvironmentDtoSchema = z.object({
  type: z.literal("WORLD_ROOM"),
  data: z.object({
    environment: createSelectSchema(environments),
    worldRoomEnvironment: createSelectSchema(worldRoomEnvironments),
  }),
});

export const CreateWorldRoomEnvironmentDtoSchema = z.object({
  type: z.literal("WORLD_ROOM"),
  id: createInsertSchema(worldRoomEnvironments).shape.id,
});

export class WorldRoomEnvironmentDto extends createZodDto(
  WorldRoomEnvironmentDtoSchema,
) {}
export class CreateWorldRoomEnvironmentDto extends createZodDto(
  CreateWorldRoomEnvironmentDtoSchema,
) {}

/**
 * Unions
 */

export const EnvironmentDtoSchema = z.discriminatedUnion("type", [
  CompanionOneToOneEnvironmentDtoSchema,
  WorldRoomEnvironmentDtoSchema,
]);

export const CreateEnvironmentDtoSchema = z.discriminatedUnion("type", [
  CreateCompanionOneToOneEnvironmentDtoSchema,
  CreateWorldRoomEnvironmentDtoSchema,
]);

/**
 * Types
 */
export type CreateEnvironmentDto = z.infer<typeof CreateEnvironmentDtoSchema>;
export type EnvironmentDto = z.infer<typeof EnvironmentDtoSchema>;

type EnvironmentDtoMap = {
  COMPANION_ONE_TO_ONE: CompanionOneToOneEnvironmentDto;
  WORLD_ROOM: WorldRoomEnvironmentDto;
};

export type InferEnvironmentDto<T extends CreateEnvironmentDto> = T extends {
  type: keyof EnvironmentDtoMap;
}
  ? EnvironmentDtoMap[T["type"]]
  : never;

/**
 * Socket Events
 */
export const EnvironmentsRoomJoinedEventSchema = z.object({
  user: createSelectSchema(users),
  environment: EnvironmentDtoSchema,
});

export const EnvironmentsRoomLeftEventSchema = z.object({
  user: createSelectSchema(users),
  environment: EnvironmentDtoSchema,
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
