import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { environmentAiTasks } from "../../db/core/core.schema";
import { AiUserDtoSchema } from "../user/user.dto";
import { z } from "zod";

/**
 * Create
 */
export const CreateEnvironmentAiTaskDtoSchema =
  createInsertSchema(environmentAiTasks);

export class CreateEnvironmentAiTaskDto extends createZodDto(
  CreateEnvironmentAiTaskDtoSchema,
) {}

/**
 * Read
 */
export const EnvironmentAiTaskDtoSchema = createSelectSchema(environmentAiTasks)
  .omit({ aiUserId: true })
  .extend({
    aiUser: AiUserDtoSchema.shape.data,
    createdAt: z.coerce.date(),
  });

export class EnvironmentAiTaskDto extends createZodDto(
  EnvironmentAiTaskDtoSchema,
) {}

export const ActiveEnvironmentAiTaskDtoSchema =
  EnvironmentAiTaskDtoSchema.extend({
    state: EnvironmentAiTaskDtoSchema.shape.state.exclude(["COMPLETE"]),
  });

export class ActiveEnvironmentAiTaskDto extends createZodDto(
  ActiveEnvironmentAiTaskDtoSchema,
) {}
