import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { sessions, users } from "../schema";
import { z } from "zod";

/**
 * Session
 */

export const SessionDtoSchema = z.object({
  session: createSelectSchema(sessions),
  user: createSelectSchema(users),
});

export const CreateSessionDtoSchema = z.object({
  userId: createSelectSchema(users).shape.id,
});

export class SessionDto extends createZodDto(SessionDtoSchema) {}
export class CreateSessionDto extends createZodDto(CreateSessionDtoSchema) {}

/**
 * Queries
 */

export const FindSessionsQueryDtoSchema = z.object({
  ids: z.array(createSelectSchema(sessions).shape.id).optional(),
  limit: z.number().optional(),
});

export class FindSessionsQueryDto extends createZodDto(
  FindSessionsQueryDtoSchema,
) {}
