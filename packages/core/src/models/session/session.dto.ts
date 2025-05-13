import { createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { humanUsers, sessions } from "../../db/app/app.schema";
import { HumanUserDtoSchema } from "../user/user.dto";

/**
 * Session
 */

export const SessionDtoSchema = createSelectSchema(sessions).extend({
  user: HumanUserDtoSchema,
});

export const CreateSessionDtoSchema = z.object({
  humanUserId: createSelectSchema(humanUsers).shape.id,
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
