import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { humanUserRoomEnvironments, humanUsers } from "../../db/app.schema";
import { z } from "zod";

/**
 * Create
 */
export const CreateHumanUserRoomEnvironmentDtoSchema = createInsertSchema(
  humanUserRoomEnvironments,
).pick({
  userId: true,
  slug: true,
  order: true,
});

export class CreateHumanUserRoomEnvironmentDto extends createZodDto(
  CreateHumanUserRoomEnvironmentDtoSchema,
) {}

/**
 * Read
 */
export const HumanUserRoomEnvironmentDtoSchema = createSelectSchema(
  humanUserRoomEnvironments,
);

export class HumanUserRoomEnvironmentDto extends createZodDto(
  HumanUserRoomEnvironmentDtoSchema,
) {}

/**
 * Filter
 */
export const FindUserRoomEnvironmentByPathDtoSchema = z.object({
  tag: z.string(),
  channel: z.string(),
});

export class FindUserRoomEnvironmentByPathDto extends createZodDto(
  FindUserRoomEnvironmentByPathDtoSchema,
) {}
